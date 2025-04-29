<?php

if( isset($_POST["user"]) && !isser($_SESSION["users"][$_POST["user"]]) ){
    $_SESSION["users"][$_POST["user"]] = $_POST["user"];
}


if(isset($_SESSION["users"])){
    var_dump($_SESSION["users"]);
}
