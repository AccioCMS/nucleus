<?php

namespace Accio\User\Models;

use Accio\Support\BootEventsTrait;
use Accio\Support\CollectionTrait;
use Accio\Support\TranslatableTrait;
use App\Models\Language;
use App\Notifications\UserAdded;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Accio\User\Models\Traits;
use Accio\Support\Facades\Meta;
use Laravel\Passport\HasApiTokens;
use Spatie\Activitylog\Traits\HasActivity;

class UserModel extends Authenticatable
{
    use
        Notifiable,
        HasActivity,
        Notifiable,
        Traits\UserTrait,
        TranslatableTrait,
        Cachable,
        BootEventsTrait,
        CollectionTrait,
        HasApiTokens;

    /**
     * fields that can be filled in CRUD.
     *
     * @var array
     */
    protected $fillable = [
        'firstName','lastName','email', 'password','phone','address','country','isActive','profileImageID','about','slug','gravatar'
    ];

    /**
     * Hidden fields that can be seen in CRUD.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
    /**
     * column data-types.
     *
     * @var array
     */
    protected $casts = [
        'about' => 'object'
    ];

    /**
     * json columns
     *
     * @var array
     */
    protected $translatableColumns = [
        'about' => "string"
    ];

    /**
     * @var string
     */
    public $primaryKey = "userID";

    /**
     * The table associated with the model.
     *
     * @var string $table
     */
    public $table = "users";

    /**
     * Lang key that points to the multi language label in translate file.
     *
     * @var string
     */
    public static $label = "User.label";

    /**
     * default permissions that will be listed in settings of permissions.
     *
     * @var array
     */
    public static $defaultPermissions = ['create','read', 'update', 'delete'];

    /**
     * how many rows to show in the pagination
     *
     * @var int
     */
    public static $rowsPerPage = 15;

    /**
     * Which fields are searchable By "advanced search" in admin area.
     *
     * @var array
     */
    public static $advancedSearchFields = [
        [
            'name'      => 'Name',
            'type'      => 'string',
            'db-column' => 'firstName'
        ],
        [
            'name'      => 'Lastname',
            'type'      => 'string',
            'db-column' => 'lastName'
        ],
        [
            'name'      => 'Email',
            'type'      => 'email',
            'db-column' => 'email'
        ],
        [
            'name'      => 'Phone',
            'type'      => 'string',
            'db-column' => 'phone'
        ],
        [
            'name'      => 'Address',
            'type'      => 'string',
            'db-column' => 'address'
        ],
        [
            'name'      => 'Country',
            'type'      => 'string',
            'db-column' => 'country'
        ],
        [
            'name'      => 'Active',
            'type'      => 'boolean',
            'db-column' => 'isActive'
        ]
    ];

    /**
     * @var bool
     */
    protected static $logFillable = true;

    /**
     * @var bool
     */
    protected static $logOnlyDirty = true;

    /**
     * @inheritdoc
     * */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        Event::fire('user:construct', [$this]);
    }

    /**
     * Handle callback of insert, update, delete.
     */
    protected static function boot()
    {
        parent::boot();

        self::created(
            function ($user) {
                try{
                    $user->notify(new UserAdded($user));
                }catch (\Exception $e){

                }
                Event::fire('user:created', [$user]);
            }
        );
    }

    /**
     * Generate the URL to a user.
     *
     * @return string
     * @throws \Exception
     */
    public function getHrefAttribute()
    {
        return $this->href();
    }

    /**
     * Generate a custom URL to a user.
     *
     * @param  string $routeName
     * @param  array  $customAttributes
     * @return string
     * @throws \Exception
     */
    public function href($routeName = '', $customAttributes = [])
    {
        if(!$routeName) {
            $routeName = 'user.single';
        }
        $getRoute = Route::getRoutes()->getByName($routeName);
        if($getRoute) {
            $routeParams = Route::getRoutes()->getByName($routeName)->parameterNames();

            // translating language
            if($this->getTranslateLanguage()) {
                $languageSlug = $this->getTranslateLanguage();
            }
            else{
                $languageSlug = App::getLocale();
            }

            //set only requested params
            $params = [];
            foreach($routeParams as $name){
                switch ($name){
                case 'authorSlug';
                    $params['authorSlug'] = $this->slug;
                    break;

                case 'lang';
                    // don't show language slug on default language
                    if(config('project.hideDefaultLanguageInURL') && $languageSlug !=  Language::getDefault('slug')) {
                        $params['lang'] = $languageSlug;
                    }
                    break;
                }
            }

            if($customAttributes) {
                $params = array_merge($customAttributes, $params);
            }

            return route($routeName, $params);
        }else{
            throw new \Exception("Route $routeName not found");
        }

    }

    /**
     * Full name of the user.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return $this->firstName." ".$this->lastName;
    }

    /**
     * Destruct model instance.
     */
    public function __destruct()
    {
        Event::fire('user:destruct', [$this]);
    }

    /**
     * Get posts of users
     */
    public function posts()
    {
        return $this->hasMany('App\Models\Post', 'createdByUserID');
    }

    /**
     * Get user roles.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
    public function roles()
    {
        return $this->hasManyThrough(
            'App\Models\UserGroup',
            'App\Models\RoleRelation',
            'userID',
            'groupID',
            'userID',
            'groupID'
        );
    }


    /**
     * Get Profile Image that belong to a user.
     *
     * @return mixed
     */
    public function getProfileImageAttribute()
    {
        if($this->profileImageID) {
            return $this->getRelationValue('profileimage');
        }
        return null;
    }

    /**
     * Get profile image.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function profileImage()
    {
        return $this->hasOne('App\Models\Media', 'mediaID', 'profileImageID');
    }

    /**
     * Define single user's SEO Meta data.
     *
     * @return array
     */
    public function metaData()
    {
        Meta::setTitle($this->fullName)
            ->set("description", $this->about)
            ->set("og:type", "profile", "property")
            ->set("og:title", $this->fullName, "property")
            ->set("og:description", $this->about, "property")
            ->set("og:url", $this->href, "property")
            ->setImageOG($this->profileImage)
            ->setProfileOG($this)
            ->setHrefLangData($this)
            ->setCanonical($this->href)
            ->setWildcards(
                [
                '{{firstName}}' => $this->firstName,
                '{{lastName}}' => $this->lastName,
                '{{title}}' => $this->firstName . " " . $this->lastName,
                '{{sitename}}' => settings('siteTitle')
                ]
            );
    }

}
