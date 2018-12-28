<?php
namespace Accio\Support\Facades;

use Illuminate\Support\Facades\Facade;

class Routes extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \Accio\Routing\Routes::class;
    }
}
