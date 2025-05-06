<?php
$output = shell_exec('ipconfig');
preg_match('/IPv4[^:]*: ([\d\.]+)/', $output, $matches);
echo  $matches[1];
