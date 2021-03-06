<?php

namespace Accio\Auth;

use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Http\Request;
use Accio\Routing\MainController;


class BaseLoginController extends MainController
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Create a new controller instance.
     * Only "logout" method is allowed to be accessed by guest
     */
    public function __construct()
    {
        $this->middleware('guest:admin', ['except' => 'logout']);
        parent::__construct();
    }

    /**
     * Where to redirect users after login.
     *
     * @var    string
     * @return string
     */
    protected function redirectTo()
    {
        return '/'.Config::get('project')['adminPrefix'].'?mode=menu';
    }

    /**
     * Show the application's login form.
     *
     * @return \Illuminate\Http\Response
     */
    public function showLoginForm()
    {
        return view('accio::auth.login');
    }

    /**
     * Define admin guard
     *
     * @return mixed
     */
    protected function guard()
    {
        return Auth::guard('admin');
    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $this->guard("admin")->logout();
        return redirect(route('backend.auth.login'));
    }
}
