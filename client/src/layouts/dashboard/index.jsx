import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { useRouter } from 'src/routes/hooks';

import Nav from './nav';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const token = useSelector((state) => state.user.token);
  const id = useSelector((state) => state.user.id);
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    if (!id || !token) {
      router.push('/login');
    }
  }, [id, token, router]);

  return (
    <>
      {id && token && (
        <>
          <Header onOpenNav={() => setOpenNav(true)} />

          <Box
            sx={{
              minHeight: 1,
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
            }}
          >
            <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

            <Main>{children}</Main>
          </Box>
        </>
      )}
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
