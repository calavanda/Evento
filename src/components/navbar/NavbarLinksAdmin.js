import {
  Button,
  Flex,
  Icon,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';

import { MdMenu } from "react-icons/md";
import PropTypes from 'prop-types';
import React from 'react';
// Assets
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { UserButton } from '@clerk/clerk-react';

export default function HeaderLinks(props) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const navbarIcon = useColorModeValue('gray.400', 'white');
  const mainText = useColorModeValue('navy.700', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
			<Button
				display={{ base: 'flex', xl: 'none' }}
				onClick={props.onToggle}
				colorScheme="brand"
				variant="ghost"
				p="0px"
				borderRadius="inherit"
				_active={{ bg: 'inherit' }}
				_hover={{ bg: 'inherit' }}
			>
				<Icon as={MdMenu} color={mainText} w="20px" h="20px" />
			</Button>
      <Flex ms="10px">
        <UserButton afterSignOutUrl="/" />
      </Flex>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
  onToggle: PropTypes.func,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object),
};
