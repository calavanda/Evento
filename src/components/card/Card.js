import { Box, useStyleConfig, forwardRef } from "@chakra-ui/react";
const Card = forwardRef((props, ref) => {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig("Card", { variant });

  return (
    <Box ref={ref} __css={styles} {...rest}>
      {children}
    </Box>
  );
});

export default Card;
