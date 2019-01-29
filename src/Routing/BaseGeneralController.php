<?php

namespace Accio\Routing;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Language;
use App\Models\MenuLink;
use App\Models\Settings;
use App\Models\Plugin;
use App\Models\PostType;
use Illuminate\Support\Facades\Session;

class BaseGeneralController extends MainController
{

    /**
     * BaseGeneralController constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Route to logout user.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function logoutUser()
    {
        Auth::logout();
        return redirect(route('backend.auth.login'));
    }

    /**
     * Get Base data for Vue start.
     *
     * @return array
     * @throws \Exception
     */
    public function getBaseData(Request $request)
    {
        // menu links for the application part
        $applicationMenuLinks = MenuLink::applicationMenuLinks();
        // menu links for the cms part
        $cmsMenus = MenuLink::cmsMenus();

        // user data
        $user = Auth::user();
        $user->avatar = $user->avatar(200, 200, true);

        // Get Labels
        //$labels = Language::getlabels();
        $pluginsConfigs = Plugin::configs();

        // Logo
        $projectLogo =  Settings::logo();
        if($projectLogo) {
            $projectLogoURL = asset($projectLogo->thumb(200, 200));
        }else{
            $projectLogoURL = asset('public/images/logo-mana.png');
        }

        $settings  =  Settings::getAllSettings();
        $settings['logo'] = $projectLogoURL;

        // User data object
        $postTypeSlugs = PostType::all()->toArray();
        $postTypeSlugs = array_pluck($postTypeSlugs, "slug");

        $globalData = [
            'post_type_slugs' => $postTypeSlugs,
            'permissions' => $user->getPermissions(),
            'settings' => $settings,
            'ini_upload_max_filesize' => ini_get('upload_max_filesize'),
            'ini_post_max_size' => ini_get('post_max_size')
        ];

        // all languages
        $languages = Language::select('name as title', 'slug as id', 'languageID')->get();
        //$request->session()->flush();
        return [
            'languages' => $languages,
            'applicationMenuLinks' => $applicationMenuLinks,
            'cmsMenus' => $cmsMenus,
            'auth' => $user,
            'pluginsConfigs' => $pluginsConfigs,
            'global_data' => $globalData,
            'accessToken' => session('accessToken')
        ];
    }

}
