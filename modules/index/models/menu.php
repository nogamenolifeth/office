<?php
/**
 * @filesource modules/index/models/menu.php
 * @link http://www.kotchasan.com/
 * @copyright 2016 Goragod.com
 * @license http://www.kotchasan.com/license/
 */

namespace Index\Menu;

use \Gcms\Login;

/**
 * รายการเมนู
 *
 * @author Goragod Wiriya <admin@goragod.com>
 *
 * @since 1.0
 */
class Model
{

  /**
   * รายการเมนู
   *
   * @param array $login
   * @return array
   */
  public static function getMenus($login)
  {
    $menus = array(
      'home' => array(
        'text' => '{LNG_Home}',
        'url' => 'index.php?module=home'
      ),
      'ar' => array(
        'text' => '{LNG_Account Receivable}',
        'submenus' => array(
          array(
            'text' => '{LNG_Customer}',
            'url' => 'index.php?module=ar-customer'
          ),
          array(
            'text' => '{LNG_Add New} {LNG_Customer}',
            'url' => 'index.php?module=ar-detail'
          ),
        ),
      ),
      'report' => array(
        'text' => '{LNG_Report}',
        'submenus' => array(
          array(
            'text' => '{LNG_Monthly report}',
            'url' => 'index.php?module=ar-monthlyreport'
          ),
          array(
            'text' => '{LNG_Creditors report}',
            'url' => 'index.php?module=ar-creditorsreport'
          ),
        ),
      ),
      'member' => array(
        'text' => '{LNG_Users}',
        'submenus' => array(
          array(
            'text' => '{LNG_Member list}',
            'url' => 'index.php?module=member'
          ),
          array(
            'text' => '{LNG_Register}',
            'url' => 'index.php?module=register'
          )
        ),
      ),
      'settings' => array(
        'text' => '{LNG_Settings}',
        'submenus' => array(
          array(
            'text' => '{LNG_Site settings}',
            'url' => 'index.php?module=system'
          ),
          array(
            'text' => '{LNG_Email settings}',
            'url' => 'index.php?module=mailserver'
          ),
          array(
            'text' => '{LNG_Account Receivable}',
            'url' => 'index.php?module=ar-settings'
          ),
          array(
            'text' => '{LNG_Creditor}',
            'url' => 'index.php?module=ar-creditor'
          ),
        ),
      ),
      'signout' => array(
        'text' => '{LNG_Sign Out}',
        'url' => 'index.php?action=logout'
      ),
    );
    // สามารถตั้งค่าระบบได้
    if (!Login::checkPermission($login, 'can_config')) {
      unset($menus['settings']);
    }
    // พนักงานบัญชี
    if (!Login::checkPermission($login, 'accountant')) {
      unset($menus['ar']);
      unset($menus['report']);
    }
    // ไม่ใช่แอดมิน
    if (!Login::isAdmin()) {
      unset($menus['member']);
    }
    return $menus;
  }
}
