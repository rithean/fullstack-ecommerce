<?php

namespace Database\Seeders;

use App\Models\About;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AboutUsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        About::create([
            'header_title' => 'About Us',
            'header_description' => 'Learn more about our mission, values, and why we are the best choice for your online shopping experience.',
            'mission' => 'We are committed to offering a vast selection of quality products at competitive prices. Our goal is to provide an easy and seamless shopping experience for our customers.',
            'values' => json_encode([
                ['icon' => 'FaHeart', 'title' => 'Customer First', 'description' => 'We prioritize our customers by offering great service, fast delivery, and hassle-free returns.'],
                ['icon' => 'FaAward', 'title' => 'Quality Products', 'description' => 'Our products are carefully selected to ensure that you receive the best value for your money.'],
                ['icon' => 'FaUsers', 'title' => 'Teamwork', 'description' => 'Our team works together to ensure a smooth and enjoyable experience for our customers.'],
                ['icon' => 'FaShippingFast', 'title' => 'Fast Shipping', 'description' => 'We offer fast, reliable shipping options so that your orders arrive as quickly as possible.'],
            ]),
            'team' => json_encode([
                ['name' => 'Sok Rithean', 'position' => 'Fullstack Web Developer', 'image' => '../assets/images/rithean.jpg'],
                ['name' => 'San Chetra', 'position' => 'Fullstack Mobile Developer', 'image' => '../assets/images/tra.jpg'],
            ]),
        ]);
    }
}
