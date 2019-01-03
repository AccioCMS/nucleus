<?php

namespace Accio\Plugin\Controllers;

use Accio\Routing\MainController;

class BasePluginController extends MainController
{
    /**
     * Return view for plugin.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function pluginView()
    {
        return view('index');
    }


}
