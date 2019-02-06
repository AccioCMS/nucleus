<?php

namespace Accio\Label\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Http\Request;
use Accio\Database\AccioQuery;
use Accio\Routing\MainController;
use App\Models\Language;
use App\Models\Label;
use stdClass;


class BaseLabelController extends MainController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getLabelsByModule($module){
        $languages = Language::all();
        $labels = Label::where('module', $module)->get();

        $items = [];
        foreach($languages as $language){
            $item = [];
            $item['lang'] = $language->slug;

            $values = new stdClass;
            foreach ($labels as $label){
                $values->{$label->labelKey} = $label->value->{$language->slug};
            }
            $item['data'] = $values;

            $items[] = $item;
        }

        return response()->json(['data' => $items]);
    }

}
