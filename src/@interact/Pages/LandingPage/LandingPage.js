import JumboContentLayout from "@jumbo/components/JumboContentLayout";
import { useJumboTheme } from "@jumbo/hooks";

const LandingPage = () => {
  const { theme } = useJumboTheme();
  return (
    <JumboContentLayout
      layoutOptions={{
        wrapper: {
          sx: {
            [theme.breakpoints.up("xl")]: {
              px: 2,
            },
            [theme.breakpoints.up("xxl")]: {
              px: 30,
            },
          },
        },
      }}
    ></JumboContentLayout>
  )
}

export default LandingPage;