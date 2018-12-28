<?php
$files = glob(__DIR__ . '/Helpers/*.php');
foreach ($files as $file) {
    require_once $file;
}
unset($files);
