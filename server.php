<?php
session_start();
$_SESSION["users"] = [];


use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require __DIR__ . '/Ratchet/vendor/autoload.php';

class MyChat implements MessageComponentInterface {
    protected $clients;
    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }
    public function onOpen(ConnectionInterface $conn) {
        $this->clientId = $conn->resourceId;        
        $this->clients->attach($conn);
        //$conn->send(json_encode([$_SESSION["users"]]));
        //var_dump($_SESSION);

    }
    public function onMessage(ConnectionInterface $from, $msg) {


        foreach ($this->clients as $client) {
            $data = json_decode($msg, true);
            if($data["type"] == "globalMessage"){

                //$client->send( "$data[message] from $data[user] -> $this->clientId" );
                $client->send( json_encode(["message"=>"Message from $data[from] -> $this->clientId"]) );

            }
            else if($data["type"] == "auth"){
                if( in_array($data["user"], $_SESSION["users"]) ){
                    echo "$data[user] felhasználónév foglalt\n";
                }
                else{

                    

                    //echo "$data[user] ($this->clientId) csatlakozott\n";
                    $_SESSION["users"][$this->clientId ] = $data["user"];

                    $client->send( json_encode(["type"=>"onlineUsers","list"=>$_SESSION["users"]]) );

                }
            }
            else if($data["type"] == "relog"){
                //echo "$data[user] ($this->clientId) újra csatlakozott\n";
                $_SESSION["users"][$this->clientId ] = $data["user"];
                $client->send( json_encode(["type"=>"onlineUsers","list"=>$_SESSION["users"]]) );


            }

            
            else if($data["type"] == "getOnlineUsers"){
                //print_r($_SESSION);
                $client->send( json_encode(["type"=>"onlineUsers","list"=>$_SESSION["users"]]) );

            }
            
            //echo $this->clientId . "\n";

            var_dump($_SESSION);
            
            //$client->send($data["type"]);
            //$client->send( $msg["message"] );
        }
      //  var_dump($client);
            
    }
    public function onClose(ConnectionInterface $conn) {
        echo "$this->clientId kilépett\n\n\n\n\n\n";
        unset($_SESSION["users"][$this->clientId ]);
        var_dump($_SESSION);
        $this->clients->detach($conn);
    }
    public function onError(ConnectionInterface $conn, \Exception $e) {
        $conn->close();
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new MyChat()
        )
    ),
    8091,
    '0.0.0.0'  // EZ FONTOS!
);

$server->run();
