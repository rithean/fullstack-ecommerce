<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    //
    use HasFactory;
    protected $fillable = [
        'header_title',
        'header_description',
        'mission',
        'values',
        'team',
    ];

    protected $casts = [
        'values' => 'array',
        'team' => 'array',
    ];
}
