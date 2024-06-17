import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
    access: ["HR"],
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
    access: ["HR", "Pseudo Admin"],
  },
  {
    title: 'department',
    path: '/department',
    icon: icon('ic_department'),
    access: ["HR"],
  },
  {
    title: 'application',
    path: '/application',
    icon: icon('ic_application'),
    access: ["All"],
  },
  {
    title: 'profile',
    path: '/profile',
    icon: icon('ic_profile'),
    access: ["All"],
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
    access: ["All"],
  },
];

export default navConfig;
