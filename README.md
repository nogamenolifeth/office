# คชสาร เว็บเฟรมเวิร์ค (Kotchasan Web Framework)
ตัวอย่างระบบเว็บไซต์เก็บข้อมูลส่วนบุคคลแบบสมบูรณ์ สามารถนำไปใช้เป็นแกนของระบบในการพัฒนาต่อได้ ตัวระบบประกอบด้วย
* ระบบ Login
* ระบบ ขอรหัสผ่านใหม่
* ระบบอีเมล์ พร้อมระบบการตั้งค่าการส่งอีเมล์บนเว็บไซต์ ในเบื้องต้นใช้ประโยชน์จากอีเมล์ในการขอรหัสผ่านใหม่
* ระบบสมาชิก แบ่งเป็นหลายระดับ เบื่องต้นคือแอดมินและสมาชิกทั่วไป พร้อมระบบการจัดการ การลงทะเบียน แก้ไขข้อมูลสมาชิก
* ระบบ permission ใช้ในการกำหนดสิทธิของสมาชิกเป็นรายบุคคล
* ระบบเว็บไซต์ที่ใช้การโหลดหน้าเว็บด้วย Ajax และ API (GLoader) โหลดไวกว่าและสามารถออกแบบหน้าเว็บได้ตามปกติ
* ระบบเว็บไซต์ 2 ภาษา
* Theme รองรับการใช้งาน Responsive

## การติดตั้ง
### 1. สร้างฐานข้อมูล ```u``` และ ตารางตามโค้ดด้านล่าง

```
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `permission` text COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `sex` varchar(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_card` varchar(13) COLLATE utf8_unicode_ci DEFAULT NULL,
  `expire_date` date DEFAULT NULL,
  `address` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `provinceID` varchar(3) COLLATE utf8_unicode_ci DEFAULT NULL,
  `zipcode` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `visited` int(11) NOT NULL,
  `lastvisited` int(11) NOT NULL,
  `session_id` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ip` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=10 ;

INSERT INTO `user` (`id`, `username`, `password`, `status`, `permission`, `name`, `sex`, `id_card`, `expire_date`, `address`, `phone`, `provinceID`, `zipcode`, `visited`, `lastvisited`, `session_id`, `ip`, `create_date`) VALUES
(1, 'admin@localhost', 'b620e8b83d7fcf7278148d21b088511917762014', 1, 'can_config,can_login', 'นายแอดมิน ทดสอบ', 'm', '', '1899-11-30', '', '', '103', '71190', 6, 1498474123, 'vm6b3am1spcu3npoeuo0056lv2', '171.97.193.41', '0000-00-00 00:00:00'),
(2, 'demo@localhost', 'db75cdf3d5e77181ec3ed6072b56a8870eb6822d', 0, 'can_login', 'นายทดสอบ ตัวอย่าง', 'm', '', NULL, '', '', '102', '', 1, 1498476361, 'vm6b3am1spcu3npoeuo0056lv2', '171.97.193.41', '0000-00-00 00:00:00');

```

### 2. แก้ไขค่าติดตั้งของฐานข้อมูลให้ถูกต้อง ไฟล์ settings/database.php

```
<?php
/* settings/database.php */
return array(
  'mysql' => array(
    'dbdriver' => 'mysql',
    'username' => 'plus',
    'password' => '1234',
    'dbname' => 'u',
    'prefix' => '',
  ),
  'tables' => array(
    'user' => 'user'
  )
);
```

### 3. สร้างไดเร็คทอรี่ ```datas/``` และปรับ chmod เป็น 777

## การใช้งาน
เข้าระบบโดย User : ```admin@localhost``` และ Password : ```admin```