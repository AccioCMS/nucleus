<?php

namespace Accio\Theme\Models;

use Illuminate\Support\Facades\Event;
use Route;
use Illuminate\Database\Eloquent\Model;
use Accio\Support\CollectionTrait;
use Accio\Theme\Models\Traits;

class ThemeModel extends Model
{
    use
      Traits\ThemeTrait,
      CollectionTrait;

    /**
     * @inheritdoc
     * */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->setActiveTheme();

        Event::fire('theme:construct', [$this]);
    }

    /**
     * Handle callback of insert, update, delete.
     * */
    protected static function boot()
    {
        parent::boot();

        self::saving(
            function ($theme) {
                Event::fire('theme:saving', [$theme]);
            }
        );

        self::saved(
            function ($theme) {
                Event::fire('theme:saved', [$theme]);
            }
        );

        self::updating(
            function ($theme) {
                Event::fire('theme:updating', [$theme]);
            }
        );

        self::creating(
            function ($theme) {
                Event::fire('theme:creating', [$theme]);
            }
        );

        self::created(
            function ($theme) {
                Event::fire('theme:created', [$theme]);
            }
        );

        self::updated(
            function ($theme) {
                Event::fire('theme:updated', [$theme]);
            }
        );

        self::deleting(
            function ($theme) {
                Event::fire('theme:deleting', [$theme]);
            }
        );

        self::deleted(
            function ($theme) {
                Event::fire('theme:deleted', [$theme]);
            }
        );
    }

    /**
     * Destruct model instance
     */
    public function __destruct()
    {
        Event::fire('theme:destruct', [$this]);
    }
}
