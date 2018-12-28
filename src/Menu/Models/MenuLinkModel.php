<?php

namespace Accio\Menu\Models;

use Accio\Menu\Models\Traits\MenuLinkTrait;
use Accio\Support\BootEventsTrait;
use Accio\Support\CollectionTrait;
use Accio\Support\Facades\Meta;
use Accio\Support\TranslatableTrait;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Event;
use Spatie\Activitylog\Traits\LogsActivity;

class MenuLinkModel extends Model
{

    use
        Cachable,
        LogsActivity,
        MenuLinkTrait,
        TranslatableTrait,
        BootEventsTrait,
        CollectionTrait;

    /**
     * Fields that can be filled in CRUD.
     *
     * @var array $fillable
     */
    protected $fillable = ['menuID', 'belongsTo', 'belongsToID', 'label', 'slug', 'parent', 'cssClass', 'order', 'customLink', 'controller', 'method', 'routeName','params'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'label' => 'object',
        'params' => 'object',
        'slug' => 'object',
    ];

    /**
     * The primary key of the table.
     *
     * @var string $primaryKey
     */
    protected $primaryKey = "menuLinkID";


    /**
     * The table associated with the model.
     *
     * @var string $table
     */
    public $table = "menu_links";

    /**
     * Lang key that points to the multi language label in translate file.
     *
     * @var string
     */
    public static $label = "MenuLink.label";

    /**
     * Default permissions that will be listed in settings of permissions.
     *
     * @var array $defaultPermissions
     */
    public static $defaultPermissions = ['create','read', 'update', 'delete'];

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
        Event::fire('menuLink:construct', [$this]);
    }

    /**
     * Destruct model instance.
     */
    public function __destruct()
    {
        Event::fire('menuLink:destruct', [$this]);
    }

    /**
     * Define single post's SEO Meta data.
     *
     * @return void;
     */
    public function metaData()
    {
        Meta::setTitle($this->label)
        //            ->set("og:type", "article", "property")
        //            ->set("og:title", $this->label, "property")
        //            ->set("og:description", $this->content(), "property")
            ->set("og:url", $this->href, "property")
        //            ->setImageOG(($this->hasFeaturedImage() ? $this->featuredImage : null))
        //            ->setArticleOG($this)
        //            ->setHrefLangData($this)
            ->setCanonical($this->href)
            ->setWildcards(
                [
                '{{title}}' => $this->label,
                '{{sitename}}' => settings('siteTitle')
                ]
            );

        return;
    }

}


