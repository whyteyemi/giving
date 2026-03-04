<?php
require_once __DIR__ . '/backend/bootstrap.php';
require_once __DIR__ . '/backend/api_handlers.php';

$pdo = gwl_db($config);
$action = $_GET['action'] ?? '';
$data = gwl_read_json_body();

try {
  switch ($action) {
    case 'health':
      gwl_health();
      break;

    // Auth
    case 'login':
      gwl_login($pdo, $config, $data);
      break;
    case 'signup':
      gwl_signup($pdo, $data);
      break;
    case 'get_me':
      gwl_get_me($pdo, $config);
      break;

    // Public reads
    case 'get_events':
      gwl_list_public_table($pdo, 'events', 'date');
      break;
    case 'get_all_event_media':
      gwl_list_public_table($pdo, 'event_media', 'created_at');
      break;
    case 'get_impact':
      gwl_list_public_table($pdo, 'impact_records', 'created_at');
      break;
    case 'get_event_media':
      gwl_get_event_media($pdo, $_GET['event_id'] ?? '');
      break;

    // Admin/staff reads
    case 'get_profiles':
      gwl_list_table_admin($pdo, $config, 'profiles', 'created_at');
      break;
    case 'get_volunteers':
      gwl_list_table_admin($pdo, $config, 'volunteer_applications', 'created_at');
      break;
    case 'get_field_reports':
      gwl_list_table_admin($pdo, $config, 'field_reports', 'created_at');
      break;

    // Admin writes
    case 'add_event':
      gwl_add_event($pdo, $config, $data);
      break;
    case 'delete_event':
      gwl_delete_by_id_admin($pdo, $config, 'events', (string)($data['id'] ?? ''));
      break;

    case 'add_event_media':
      gwl_add_event_media($pdo, $config, $data);
      break;
    case 'delete_event_media':
      gwl_delete_by_id_admin($pdo, $config, 'event_media', (string)($data['id'] ?? ''));
      break;

    case 'add_impact':
      gwl_add_impact($pdo, $config, $data);
      break;
    case 'delete_impact':
      gwl_delete_by_id_admin($pdo, $config, 'impact_records', (string)($data['id'] ?? ''));
      break;

    case 'upload_media':
      gwl_upload_media($config);
      break;

    case 'update_me':
      gwl_update_me($pdo, $config, $data);
      break;

    case 'update_profile':
      gwl_update_profile_admin($pdo, $config, $data);
      break;
    case 'delete_profile':
      gwl_delete_by_id_admin($pdo, $config, 'profiles', (string)($data['id'] ?? ''));
      break;

    case 'update_volunteer':
      gwl_update_volunteer_status($pdo, $config, $data);
      break;
    case 'delete_volunteer':
      gwl_delete_by_id_admin($pdo, $config, 'volunteer_applications', (string)($data['id'] ?? ''));
      break;

    case 'add_field_report':
      gwl_add_field_report($pdo, $config, $data);
      break;
    case 'update_field_report':
      gwl_update_field_report($pdo, $config, $data);
      break;
    case 'delete_field_report':
      gwl_delete_by_id_admin($pdo, $config, 'field_reports', (string)($data['id'] ?? ''));
      break;

    // Public forms (no auth)
    case 'submit_volunteer_application':
      gwl_submit_volunteer_application($pdo, $data);
      break;
    case 'forgot_password':
      gwl_forgot_password($pdo, $config, $data);
      break;
    case 'reset_password':
      gwl_reset_password($pdo, $data);
      break;
    case 'submit_ai_lead':
      gwl_submit_ai_lead($pdo, $data);
      break;

    default:
      gwl_json(['message' => 'API is live', 'action' => $action ?: null]);
  }
} catch (Throwable $e) {
  // Generic in prod
  $debug = (($config['APP_ENV'] ?? 'development') !== 'production');
  if ($debug) {
    gwl_error('Internal Server Error', 500, ['detail' => $e->getMessage()]);
  }
  gwl_error('Internal Server Error', 500);
}
