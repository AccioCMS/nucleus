<?php
namespace Accio\Media\Models;

use DB;
use Image;
use Auth;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Event;
use Spatie\Activitylog\Traits\LogsActivity;
use Accio\Support\BootEventsTrait;
use Accio\Support\CollectionTrait;
use Accio\Media\Models\Traits\MediaTrait;

class MediaModel extends Model
{
    use
        Cachable,
        MediaTrait,
        LogsActivity,
        BootEventsTrait,
        CollectionTrait;

    /**
     * Fields that can be filled in CRUD.
     *
     * @var array $fillable
     */
    protected $fillable = ['title', 'description', 'credit', 'type', 'extension', 'url', 'filename', 'fileDirectory', 'filesize', 'dimensions'];

    /**
     * The primary key of the table.
     *
     * @var string $primaryKey
     */
    protected $primaryKey = "mediaID";

    /**
     * The table associated with the model.
     *
     * @var string $table
     */
    public $table = "media";

    /**
     * Lang key that points to the multi language label in translate file.
     *
     * @var string
     */
    public static $label = "Media.label";

    /**
     * Default permissions that will be listed in settings of permissions.
     *
     * @var array $defaultPermissions
     */
    public static $defaultPermissions = ['create','read', 'update', 'delete'];

    /**
     * The number of media files to show while scrolling in the library list.
     *
     * @var int $infinitPaginationShow
     */
    public static $infinitPaginationShow = 100;

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
        Event::fire('media:construct', [$this]);
    }

    /**
     * Get all relations of a media.
     *
     * @return HasMany
     */
    public function relations()
    {
        return $this->hasMany('App\Models\MediaRelation', 'mediaID', 'mediaID');
    }

    /**
     * Scope a query to only include images.
     *
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeImages($query)
    {
        return $query->where('type', 'image');
    }


    /**
     * Scope a query to only include videos.
     *
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeVideos($query)
    {
        return $query->where('type', 'video');
    }

    /**
     * Scope a query to only include audio.
     *
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAudio($query)
    {
        return $query->where('type', 'audio');
    }

    /**
     * Scope a query to only include documents.
     *
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDocuments($query)
    {
        return $query->where('type', 'documents');
    }

    /**
     * Destruct model instance
     */
    public function __destruct()
    {
        Event::fire('media:destruct', [$this]);
    }
}
