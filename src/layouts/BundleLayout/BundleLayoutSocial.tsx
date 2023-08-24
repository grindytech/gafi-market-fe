import { Button, Icon, List, ListItem, Text } from '@chakra-ui/react';
import HeartIcon from 'public/assets/line/heart.svg';
import EyesIcon from 'public/assets/line/eye.svg';
import ShareIcon from 'public/assets/line/share.svg';

export default () => {
  return (
    <List
      position="absolute"
      transform="translateY(-100%)"
      zIndex="docked"
      bg="white"
      inset="auto 0 auto 0"
      padding={6}
      display="flex"
      fontWeight="medium"
      color="shader.a.900"
      gap={6}
      sx={{
        li: {
          display: 'inherit',
          alignItems: 'center',
          gap: 2,
        },
        svg: {
          width: 5,
          height: 5,
        },
      }}
    >
      <ListItem>
        <Button
          variant="unstyled"
          height="auto"
          display="flex"
          fontWeight="inherit"
          leftIcon={<Icon as={HeartIcon} color="primary.a.500" />}
        >
          12
        </Button>
      </ListItem>

      <ListItem>
        <Icon as={EyesIcon} />

        <Text>144</Text>
      </ListItem>

      <ListItem flex={1} justifyContent="flex-end">
        <Button
          variant="unstyled"
          height="auto"
          display="flex"
          fontWeight="inherit"
          leftIcon={<ShareIcon />}
        >
          Share
        </Button>
      </ListItem>
    </List>
  );
};
