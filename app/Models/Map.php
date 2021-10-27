<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Map extends Model
{
    use HasFactory;
    protected $table = 'map';
    protected $guarded = ['id'];
    protected $fillable = [
        'let',
        'long'
    ];

    public $timestamps = false;
}
