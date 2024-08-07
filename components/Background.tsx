import { createStyles, MantineTheme } from "@mantine/core";

const useStyles = createStyles((theme: MantineTheme) => ({
  background: {
    position: "fixed",
    // 使用 transform 实现视觉上的上下居中和左侧距离
    transform: 'translate(-50%, 10%) translateX(calc(40% + 20px))', 
    width: "15%",
    height: "80%",
    backgroundImage: 'url("/leftpic.png")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50px center',
    // backgroundSize: 'contain',
    // backgroundColor: 'red',
    zIndex: 10,
    // display: 'flex',
    // alignItems: 'center', 
    // justifyContent: 'flex-start',
  },
}));

export default function Background() {
  const { classes } = useStyles();
  return <div className={classes.background} />;
}