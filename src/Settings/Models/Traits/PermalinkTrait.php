<?php

namespace Accio\Settings\Models\Traits;

use App\Models\Permalink;

trait PermalinkTrait
{
    /**
     * Get a permalink by name.
     *
     * @param  string $belongsTo
     * @param  string $name
     * @param  string $defaultURL
     * @return string
     * @throws \Exception
     */
    public static function getByName($belongsTo, $name, $defaultURL = '')
    {
        $singlePermalink = Permalink::where('belongsTo', $belongsTo)->where("name", $name)->first();
        if ($singlePermalink && $singlePermalink->custom_url) {
            return $singlePermalink->custom_url;
        }

        if(!$singlePermalink) {
            if(!$defaultURL) {
                throw new \Exception("Permalink or default url not found in '$belongsTo' '$name' ");
            }
            return $defaultURL;
        }

        return $singlePermalink->default_url;
    }
}
