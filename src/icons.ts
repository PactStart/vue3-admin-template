import * as icons from '@ant-design/icons-vue';

const ICON_LIST = [
  'DragOutlined',
  'ForkOutlined',
  'PlayCircleOutlined',
  'UserOutlined',
  'RobotOutlined',
  'WechatWorkOutlined',
  'ProfileOutlined',
  'PercentageOutlined',
  'DatabaseOutlined',
  'FileDoneOutlined',
  'QuestionOutlined',
  'QuestionCircleOutlined',
  'SafetyOutlined',
  'SettingOutlined',
  'ApiOutlined',
  'WechatOutlined',
  'SyncOutlined',
  'GatewayOutlined',
  'SelectOutlined',
  'StopOutlined',
  'ApartmentOutlined',
  'ColumnWidthOutlined',
  'ColumnHeightOutlined',
  'PictureOutlined',
  'DeleteOutlined',
  'ToolOutlined',
  'BookOutlined',
  'SaveOutlined',
  'ZoomInOutlined',
  'ZoomOutOutlined',
  'ClusterOutlined',
  'BranchesOutlined',
  'EyeOutlined',
  'EyeInvisibleOutlined',
  'FullscreenOutlined',
  'FullscreenExitOutlined',
  'PlusOutlined'
];

export function registerIconsComp(app: App) {
  ICON_LIST.forEach((icon) => {
    app.component(icon, icons[icon]);
  });
}
