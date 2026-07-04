export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },

  
    
      {
        id: 'administration',
        title: 'Administration',
        type: 'item',
        url: '/typography',
        icon: 'ti ti-settings'
      },
    
      {
        id: 'absences',
        title: 'Absences',
        type: 'item',
        url: '/absences',
        icon: 'ti ti-alert-circle'
      },
      {
        id: 'salles',
        title: 'Salles',
        type: 'item',
        url: '/salles',
        icon: 'ti ti-building'
      },
      {
        id: 'eleves',
        title: 'Élèves',
        type: 'item',
        url: '/eleves',
        icon: 'ti ti-school'
      },
      {
        id: 'parents',
        title: 'Parents',
        type: 'item',
        url: '/parents',
        icon: 'ti ti-users'
      },
      {
        id: 'planning enseignants',
        title: 'Planning enseignants',
        type: 'item',
        url: '/planning-enseignants',
        icon: 'ti ti-calendar'
      },
      {
        id: 'enseignants',
        title: 'Enseignants',
        type: 'item',
        classes: 'nav-item',
        url: '/enseignants',
        icon: 'ti ti-chalkboard'
      },
      {
        id: 'teacher-dashboard',
        title: 'Dashboard Prof',
        type: 'item',
        classes: 'nav-item',
        url: '/teacher-dashboard',
        icon: 'ti ti-dashboard'
      },
      {
        id: 'claims',
        title: 'Rapports en cours',
        type: 'item',
        url: '/claims',
        icon: 'ti ti-file-text'
      },
      {
        id: 'reclamation',
        title: 'Réclamations',
        type: 'item',
        url: '/reclamation',
        icon: 'ti ti-message-report'
      },
      {
        id: 'matieres',
        title: 'Matieres',
        type: 'item',
        classes: 'nav-item',
        url: '/matieres',
        icon: 'ti ti-book-2'
      },
      {
        id: 'payments',
        title: 'Paiements',
        type: 'item',
        classes: 'nav-item',
        url: '/payments',
        icon: 'ti ti-credit-card'
      },
      {
        id: 'exam-result',
        title: 'Exam Result',
        type: 'item',
        url: '/notes',
        classes: 'nav-item',
        icon: 'ti ti-award'
      },
  {
    id: 'page',
    title: 'Pages',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Authentication',
        title: 'Authentication',
        type: 'collapse',
        icon: 'ti ti-key',
        children: [
          {
            id: 'logout',
            title: 'Logout',
            type: 'item',
            url: '/guest/login',
          },
          {
            id: 'account',
            title: 'account',
            type: 'item',
            url: '/guest/account',
          }
        ]
      }
    ]
  }
];
