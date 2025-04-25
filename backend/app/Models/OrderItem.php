<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    protected $fillable = [
        'product_id',
        'order_id',
        'name',
        'price',
        'qty',
    ];

    // Relationship with the Product model
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Relationship with the Order model
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
