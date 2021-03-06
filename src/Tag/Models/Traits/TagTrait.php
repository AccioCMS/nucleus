<?php
namespace Accio\Tag\Models\Traits;

use App\Models\PostType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\HtmlString;

trait TagTrait
{

    /**
     * Get tag by Slug.
     *
     * @param  string $tagSlug Slug of tag
     * @return object|null Returns an object with post type's data if found, or null if not found
     * */
    public static function findBySlug($tagSlug)
    {
        return self::where('slug', $tagSlug)->first();
    }

    /**
     * Get tag by ID.
     *
     * @param  int $tagID ID of Tag
     * @return object|null Returns an object with tag's data if found, or null if not found
     * */
    public static function findByID($tagID)
    {
        return self::where("tagID", $tagID)->first();
    }

    /**
     * Check if there is any post related to a tag.
     *
     * @param  int    $tagID        ID of tag
     * @param  string $postTypeSlug Slug of post type
     * @return boolean Returns true if there is any post
     */
    public static function hasPosts($tagID, $postTypeSlug = '')
    {
        $postTypeSlug($postTypeSlug ? $postTypeSlug : PostType::getSlug());
        $queryObject = DB::table(tagsRelationTable($postTypeSlug))->where('tagID', $tagID);

        if($queryObject->count() > 0) {
            return true;
        }

        return false;
    }


    /**
     * Check if a tag has featured image.
     *
     * @return boolean Returns true if found
     */
    public function hasFeaturedImage()
    {
        if($this->featuredImage) {
            return true;
        }
        return false;
    }

    /**
     * Get URL of a tag's featured image.
     *
     * @param int    $width
     * @param int    $height
     * @param string $defaultFeaturedImageURL The url of an image that should be returned if no featured image is found
     *
     * @return string|null Returns url of featured image if found, null instead
     */
    public function featuredImageURL($width = null, $height = null, $defaultFeaturedImageURL = '')
    {
        if($this->hasFeaturedImage()) {
            if(!$width && !$height) {
                return url($this->featuredImage->url);
            }else{
                return $this->featuredImage->thumb($width, $height, $this->featuredImage);
            }
        }else if($defaultFeaturedImageURL) {
            return $defaultFeaturedImageURL;
        }

        return null;
    }

    /**
     * Renders featured image of a tag.
     *
     * @param  int    $width
     * @param  int    $height
     * @param  string $defaultFeaturedImageURL The url of an image that should be returned if no featured image is found
     * @return HtmlString Returns html of a tag's featured image if found, null instead
     */
    public function printFeaturedImage($width = null, $height = null, $defaultFeaturedImageURL = '')
    {
        if($this->hasFeaturedImage()) {
            return new HtmlString(
                view()->make(
                    "vendor.tags.featuredImage", [
                    'imageURL' => $this->featuredImageURL($width, $height, $defaultFeaturedImageURL),
                    'featuredImage' => $this->featuredImage
                    ]
                )->render()
            );
        }
    }
}
