<?php

namespace Accio\User\Controllers;

use Hash;
use Validator;
use Response;
use Auth;
use Illuminate\Support\Facades\Input;
use Route;
use App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use App\Models\UserGroup;
use App\Models\User;
use Accio\User\Models\RoleRelationsModel;
use Accio\Routing\MainController;
use Accio\Support\Facades\Search;
use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Input;

class BaseUserController extends MainController
{

    /**
     * Return views for search component.
     *
     * @param  string $lang
     * @param  string $term
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @throws \Exception
     */
    public function search($lang, $term)
    {
        // check if user has permissions to access this link
        if(!User::hasAccess('User', 'read')) {
            return view('errors.permissions');
        }

        return view('index');
    }

    /**
     * Make simple search with a search term.
     *
     * @param  $term
     * @return array
     */
    public function makeSearch($term)
    {
        // check if user has permissions to access this link
        if(!User::hasAccess('User', 'read')) {
            return $this->noPermission();
        }

        $orderBy = (isset($_GET['order'])) ? $orderBy = $_GET['order'] : 'userID';
        $orderType = (isset($_GET['type'])) ? $orderType = $_GET['type'] : 'DESC';

        // join parameters for the query
        // we are left joinin the the media table
        $joins = array(
          [
            'table' => 'media',
            'type' => 'left',
            'whereTable1' => "profileImageID",
            'whereTable2' => "mediaID",
          ]
        );

        $excludeColumns = array('remember_token', 'created_at', 'updated_at');
        return Search::searchByTerm('users', $term, 1, true, array(), $excludeColumns, $orderBy, $orderType, $joins);
    }

    /**
     * Get the list of all users.
     *
     * @param  string $lang Language slug (ex. en)
     * @return array
     * */
    public function getAll($lang = "")
    {
        // check if user has permissions to access this link
//        if(!User::hasAccess('User', 'read')) {
//            return $this->noPermission();
//        }

        $orderBy = (isset($_GET['order'])) ? $_GET['order'] : 'userID';

        $orderType = (isset($_GET['type'])) ? $_GET['type'] : 'DESC';

        $page = (isset($_GET['page'])) ? $page = $_GET['page'] : '';

        $size = 10;

        $size = (isset($_GET['size'])) ? $size = $_GET['size'] : $size;

        return DB::table('users')
            ->leftJoin('media', 'users.profileImageID', '=', 'media.mediaID')
            ->select("users.userID", "users.email", "users.firstName", "users.lastName", "users.slug", "users.gravatar", "media.url", "media.filename", "media.fileDirectory")
            ->orderBy($orderBy, $orderType)
            ->paginate($size)
            ->withPath('admin/en/user/list');

//        $users->withPath('custom/url');
    }



    /**
     * Get all User Groups.
     *
     * @return UserGroup[]|array|\Illuminate\Database\Eloquent\Collection
     */
    public function getGroups()
    {
        // check if user has permissions to access this link
        if(!User::hasAccess('User', 'read')) {
            return $this->noPermission();
        }
        return UserGroup::all();
    }

    /**
     * Store user in Database.
     *
     * @param  Request $request
     * @return array
     */
    public function store(Request $request)
    {


//        return "a";
        // check if user has permissions to access this link
//        if(!User::hasAccess('user', (isset($request->user['id'])) ? 'update' : 'create')) {
//            return $this->noPermission();
//        }
        // custom messages for validation
        $messages = array(
          'email.required'=>'You cant leave Email field empty',
          'firstName.required'=>'You cant leave name field empty',
        );

        $validatorFields = [
            'firstName' => 'required',
            'lastName' => 'required',
            'email' => 'required|unique:users',
            'groups' => 'required',
        ];


//        return $request['password'];

        if(isset($request->user['id'])) {
            // update user
            $user = App\Models\User::findOrFail($request->user['id']);
            $user->isActive = $request->user['isActive'];
            $currentID = $request->user['id'];
            if($user->email == $request->user['email']) {
                unset($validatorFields->user['email']);
            }
        }else{
            // Create user
            $user = new User();
            $user->createdByUserID = 21;
            $user->password = Hash::make($request->user['password']);
            $user->isActive = 1;
            $currentID = 0;

            $validatorFields['password'] = 'required|same:confpassword';
        }

        // validation
//       $validator = Validator::make($request->user, $validatorFields, $messages);
//
        // if validation fails return json response
//        if($validator->fails()) {
//            return $this->response("Please check all required fields!", 400, null, false, false, true, $validator->errors());
//        }

        // if image is not set make it 0
        if (!isset($request->user['profileImageID']) || $request->user['profileImageID'] == "") {
            $profileImageID = null;
        }else{
            $profileImageID = $request->user['profileImageID'];
        }

        // Store data
        $user->email = $request->user['email'];
        $user->firstName = $request->user['firstName'];
        $user->lastName = $request->user['lastName'];
        $user->phone = $request->user['phone'];
        $user->street = $request->user['street'];
        $user->country = $request->user['country'];
        $user->slug = parent::generateSlug($request->user['firstName']." ".$request->user['lastName'], 'users', 'userID', '', $currentID, false);
        $user->about = $request['about'];
        $user->profileImageID = $profileImageID;
        $user->gravatar = User::getGravatarFromEmail($request->user['email']);

        if($user->save()) {
            // Add roles permissions
            $user->assignRoles($request->user['groups']);
            $redirectParams = parent::redirectParams($request->redirect, 'user', $user->userID);
            $result = $this->response('User stored successfully', 200, $user->userID, $redirectParams['view'], $redirectParams['redirectUrl']);
            $result['data'] = $user;
//            return $result;
        }else{
            $result = $this->response('User could not be stored. Internal server error. Please try again later', 500);
//            return $result;
        }
        return $result;
    }


    /**
     * Change users profile image.
     *
     * @param  Request $request
     * @return array|false|string
     */
    public function storeProfileImage(Request $request)
    {
        // check if user has permissions to access this link
        if(!User::hasAccess('user', 'update')) {
            return $this->noPermission();
        }
        return $path = $request->file('profileImageID')->storeAs('images', 'filename.jpg');
    }

    /**
     * Delete user.
     *
     * @param  string $lang
     * @param  int    $id
     * @return array
     */
    public function delete($lang, $id)
    {
        if ($this->deleteUser($id)) {
            $result = $this->response('User is deleted');
        }else{
            $result = $this->response('Internal server error. Please try again later', 500);
        }
        return $result;
    }

    /**
     * Deletes user,
     * called from bulkDelete and delete functions.
     *
     * @param  int $id
     * @return array|bool
     */
    private function deleteUser($id)
    {
        $user = User::find($id);
        // user can't be deleted if it has related data to him, like posts, categories ect
        if($user->hasRelatedData()) {
            $user->isActive = false;
            if($user->save()) {
                return true;
            }
        }
        $roles = RoleRelationsModel::where('userID', $id);
        if($roles) {
            $roles->delete();
        }

        if ($user->delete()) {
            return true;
            // Delete all roles relations
        }
        return false;
    }

    /**
     * Bulk Delete users. Delete many users with on requests
     *
     * @params array of user IDs
     * */
    public function bulkDelete(Request $request)
    {
        $c = 0;
        foreach ($request->all() as $u_id){

            if (!$this->deleteUser($request->ids[$c])) {
                return $this->response('Internal server error. Please try again later', 500);
            }
            $c++;

        }
        return $this->response("User/s were deleted successfully");

    }


    /**
     * JSON object with details for a specific user.
     *
     * @param  string $lang
     * @param  int    $id
     * @return array
     */
    public function detailsJSON($lang, $id)
    {
        // check if user has permissions to access this link
//        if(\Illuminate\Support\Facades\Auth::user()->userID != $id) {
//            if (!User::hasAccess('User', 'read')) {
//                return $this->noPermission();
//            }
//        }

        $user = App\Models\User::with('roles', 'profileImage')->find($id)->appendLanguageKeys();
        $final = [
          'details' => $user,
          'allGroups' => UserGroup::all()
        ];

        // Fire event
        $final['events'] = Event::fire('user:pre_update', [$final]);
        return $final;
    }


    public function detailsJSONWithouLang($id)
    {
        // check if user has permissions to access this link
//        if(\Illuminate\Support\Facades\Auth::user()->userID != $id) {
//            if (!User::hasAccess('User', 'read')) {
//                return $this->noPermission();
//            }
//        }


        $user = App\Models\User::with('roles', 'profileImage')->find($id);
        $final = [
            'details' => $user,
            'allGroups' => UserGroup::all()
        ];

//        return $id;

        // Fire event
        $final['events'] = Event::fire('user:pre_update', [$final]);
        return $final;
    }

    public function storeUpdate(Request $request)
    {
        // check if user has permissions to access this link
//        if(!User::hasAccess('user', 'update')) {
//            return $this->noPermission();
//        }
        // validation
//        $validator = Validator::make(
//            $request->all(), [
//                'password' => 'required|same:confpassword',
//                'id' => 'required',
//            ]
//        );



        // if validation fails return json response
//        if ($validator->fails()) {
//            return $this->response("Please check all required fields!", 400, null, false, false, true, $validator->errors());
//        }
//        return $request;

//        return $request->user['id'];
        $user = App\Models\User::find($request->user['id']);
//        return $user;
        $user->email = $request->user['email'];
        $user->firstName = $request->user['firstName'];
        $user->lastName = $request->user['lastName'];
        $user->phone = $request->user['phone'];
        $user->street = $request->user['street'];
        $user->country = $request->user['country'];
        $user->isActive = $request->user['isActive'];

//        $user->save();

        if($user->save()) {
            // Add roles permissions
//            return $request->user;
            $user->assignRoles($request->user['groups']);
            $redirectParams = parent::redirectParams($request->redirect, 'user', $user->userID);
            $result = $this->response('User updated successfully', 200, $user->userID, $redirectParams['view'], $redirectParams['redirectUrl']);
            $result['data'] = $user;
//            $result = $this->response('User Was updated successfully', 200);
            return $result;
        }else{
            $result = $this->response('User could not be updated. Internal server error. Please try again later', 500);
            return $result;
        }


    }

    /**
     * Reset users password.
     *
     * @param  Request $request
     * @return array
     */
    public function resetPassword(Request $request)
    {
        // check if user has permissions to access this link
        if(!User::hasAccess('user', 'update')) {
            return $this->noPermission();
        }
        // validation
        $validator = Validator::make(
            $request->all(), [
            'password' => 'required|same:confpassword',
            'id' => 'required',
            ]
        );

        // if validation fails return json response
        if ($validator->fails()) {
            return $this->response("Please check all required fields!", 400, null, false, false, true, $validator->errors());
        }

        $user = User::where('userID', $request->id)->update(
            [
            'password' => $password = Hash::make($request->password)
            ]
        );

        if ($user) {
            $result = $this->response('Password is updated');
        }else{
            $result = $this->response('Internal server error. Please try again later', 500);
        }
        return $result;
    }

    /**
     * Get the array of fields for advanced search.
     *
     * @param  string $lang
     * @return array
     */
    public function getAdvancedSearchFields($lang = "")
    {
        // check if user has permissions to access this link
        if(!User::hasAccess('User', 'read')) {
            return $this->noPermission();
        }
        return User::$advancedSearchFields;
    }

    /**
     * Get the result of advanced search.
     *
     * @param  Request $request
     * @return array
     */
    public function getAdvancedSearchFieldsResults(Request $request)
    {
        // check if user has permissions to access this link
        if(!User::hasAccess('User', 'read')) {
            return $this->noPermission();
        }
        // join parameters for the query
        // we are left joining the the media table
        $joins = array(
          [
            'table' => 'media',
            'type' => 'left',
            'whereTable1' => "profileImageID",
            'whereTable2' => "mediaID",
          ]
        );
        return Search::advanced('users', $request, User::$rowsPerPage, $request->page, $joins);
    }

    /**
     * When the page is refreshed in while advanced search is done.
     *
     * @param  string $lang
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function searchAdvanced($lang)
    {
        // check if user has permissions to access this link
        if(!User::hasAccess('User', 'read')) {
            return view('errors.permissions', compact('lang', 'view', 'adminPrefix'));
        }
        return view('index');
    }
}
