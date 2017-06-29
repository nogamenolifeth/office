<?php
/**
 * @filesource modules/index/controllers/index.php
 * @link http://www.kotchasan.com/
 * @copyright 2016 Goragod.com
 * @license http://www.kotchasan.com/license/
 */

namespace Index\Index;

use \Kotchasan\Http\Request;
use \Gcms\Login;
use \Kotchasan\Template;
use \Kotchasan\Http\Response;

/**
 * Controller สำหรับแสดงหน้าเว็บ
 *
 * @author Goragod Wiriya <admin@goragod.com>
 *
 * @since 1.0
 */
class Controller extends \Gcms\Controller
{

  /**
   * หน้าหลักเว็บไซต์ (index.html)
   *
   * @param Request $request
   */
  public function index(Request $request)
  {
    // ตัวแปรป้องกันการเรียกหน้าเพจโดยตรง
    define('MAIN_INIT', 'indexhtml');
    // session cookie
    $request->initSession();
    // ตรวจสอบการ login
    Login::create();
    // กำหนด skin ให้กับ template
    Template::init(self::$cfg->skin);
    // View
    self::$view = new \Gcms\View;
    if ($login = Login::isMember()) {
      // โหลดเมนู
      $menu = \Index\Menu\Controller::init($login);
      // Controller หลัก
      $main = new \Index\Main\Controller;
      $bodyclass = 'mainpage';
    } else {
      // forgot, login, register
      $main = new \Index\Welcome\Controller;
      $bodyclass = 'loginpage';
    }
    $languages = array();
    $uri = $request->getUri();
    foreach (self::$view->installedLanguage() as $item) {
      $languages[$item] = '<li><a id=lang_'.$item.' href="'.$uri->withParams(array('lang' => $item), true).'" title="{LNG_Language} '.strtoupper($item).'" style="background-image:url('.WEB_URL.'language/'.$item.'.gif)" tabindex=1>&nbsp;</a></li>';
    }
    // เนื้อหา
    self::$view->setContents(array(
      // main template
      '/{MAIN}/' => $main->execute(self::$request),
      // language menu
      '/{LANGUAGES}/' => implode('', $languages),
      // title
      '/{TITLE}/' => $main->title(),
      // class สำหรับ body
      '/{BODYCLASS}/' => $bodyclass
    ));
    if ($login) {
      self::$view->setContents(array(
        // แสดงชื่อคน Login
        '/{LOGINNAME}/' => $login['name'],
        // เมนู
        '/{MENUS}/' => $menu->render($main->menu())
      ));
    }
    // ส่งออก เป็น HTML
    $response = new Response;
    $response->withContent(self::$view->renderHTML())->send();
  }
}
