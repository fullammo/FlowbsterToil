import { MenuItem } from 'fw/services/menu.service';

export let initialMenuItems: Array<MenuItem> = [
  // {
  //     text: 'Dashboard',
  //     icon: 'glyphicon-dashboard',
  //     route: 'authenticated/dashboard',
  //     submenu: null
  // },
  // {
  //     text: 'Workflows',
  //     icon: 'glyphicon-flag',
  //     route: null,
  //     submenu: [
  //         {
  //             text: 'Top 3',
  //             icon: 'glyphicon-flag',
  //             route: 'authenticated/country-list/3',
  //             submenu: null
  //         },
  //         {
  //             text: 'Top 5',
  //             icon: 'glyphicon-flag',
  //             route: 'authenticated/country-list/5',
  //             submenu: null
  //         },
  //         {
  //             text: 'All',
  //             icon: 'glyphicon-flag',
  //             route: 'authenticated/country-list/0',
  //             submenu: null
  //         }
  //     ],
  // },
  {
    text: 'Maintenance',
    icon: 'glyphicon-wrench',
    route: null,
    submenu: [
      {
        text: 'Workflow',
        icon: 'glyphicon-th-list',
        route: 'authenticated/workflow-maint',
        submenu: null
      },
      {
        text: 'Manager',
        icon: 'glyphicon-th-list',
        route: 'authenticated/workflow-man',
        submenu: null
      },
      {
        text: 'Editor',
        icon: 'glyphicon-pushpin',
        route: 'authenticated/editor',
        submenu: null
      },
      {
        text: 'Config',
        icon: 'glyphicon-cog',
        route: 'authenticated/connection',
        submenu: null
      }
    ]
  }
];
