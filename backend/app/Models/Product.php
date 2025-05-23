<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'qty',
        'description',
        'image',
        'status',
        'category_id',
        'brand_id',
        'is_trending',
        'is_limited',
    ];

    public function category() 
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
