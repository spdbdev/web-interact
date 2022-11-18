import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from "@mui/system";
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import { Stack, Box, Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './LandingPage.css';

const GradientRoundedBox = styled(Box)`
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 27px 7px rgba(120, 47, 238, 0.15);
  border-radius: ${props => props.radius ?? '45px'};
  overflow: hidden;
`;

const VideoContainer = styled(GradientRoundedBox)`
  margin-left: auto;
  margin-right: auto;
  position: relative;
  padding-bottom: 56.25%;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const Image = styled('img')`
  width: 100%;
  object-fit: cover;
  height: 100%;
`;

const Card = styled(GradientRoundedBox)`
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 100%;
  &:before {
    content: "";
    background: ${props => props.reverse
    ? 'linear-gradient(130deg, transparent 0% 33%, #DD00FF 66%, #782FEE 83.5%, #DD00FF 100%)'
    : 'linear-gradient(130deg, transparent 0% 33%, #782FEE 66%, #DD00FF 83.5%, #782FEE 100%)'};
    background-position: 0% 0%;
    transition: background-position 350ms ease;
    background-size: 300% 300%;
    height: 100%;
    left: 0px;
    position: absolute;
    top: 0px;
    width: 100%;
    z-index: 1;
  }
  &:hover:before {
    background-position: 100% 100%;
    transform: scale(1.08, 1.03);
  }
  &:hover .landing-gradient-text {
    background: transparent;
    color: white;
    -webkit-text-fill-color: white;
  }
  &:hover .landing-subtitle {
    visibility: visible;
    opacity: 1;
  }
  &:hover .landing-gray-heart {
    opacity: 1;
  }
  & > div {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
  }
`;

const blockList = [
  {
    id: 1,
    title: 'Offer the most special & in-demand perk: your attention.',
    description: `Interact helps you bring joy to your most loyal fans 
                  who have grown with you not only as a creator, but as a human being. 
                  We minimize logistical hassle and make it worth your time.`,
    icon: 'images/pages/landing/heart-book.svg',
    aos: "flip-left"
  },
  {
    id: 2,
    title: 'Both affluent & everyday fans have an opportunity to interact',
    description: `Fans can enter the giveaway for free, having a chance of acquiring an interaction, 
                  or spend a few dollars for a VIP entry (25x increased chance); 
                  more affluent fans can purchase a guaranteed interaction by bidding in the auction.`,
    icon: 'images/pages/landing/pig.svg',
    aos: "flip-right"
  },
  {
    id: 3,
    title: 'Hands off, flexible scheduling',
    description: `Input the times you want to interact week-by-week 
                  we’ll handle the rest via our matching algo (including 2-way sync with Google, 
                  Outlook & iCloud calendars to seamlessly mesh with your availability).`,
    icon: 'images/pages/landing/calendar.svg',
    aos: "flip-left"
  }
];

const FeatureCard = ({ data }) => {
  return (
    <Grid item xs={12} sm={6} md={4} data-aos={data?.aos}>
      <GradientRoundedBox sx={{ alignItems: "center", p: 4, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '230px' }}>
          <img src={data?.icon} alt='' />
        </Box>
        <Typography
          sx={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#4D4657",
            textAlign: "center",
            lineHeight: '110%',
            minHeight: '62px'
          }}
        >
          {data.title}
        </Typography>
        <Typography
          sx={{
            mt: 3,
            fontSize: "20px",
            fontWeight: 400,
            textAlign: "center",
            color: '#70677E',
            lineHeight: "120%"
          }}
        >
          {data.description}
        </Typography>
      </GradientRoundedBox>
    </Grid>
  )
};

const AnimateCard = ({ radius, padding, children, reverse }) => {
  return (
    <Card
      radius={radius ?? '0px'}
      sx={{ padding: padding ?? '10px',  }}
      reverse={reverse}
    >
      <Box>
        {children}
      </Box>
    </Card>
  )
};

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Stack maxWidth={"1440px"} alignSelf="center">
      <Stack direction="column" alignItems="center" width={"100%"}>
        <Stack width={"100%"} sx={{ mt: 15 }}>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={4} md={4}>
              <AnimateCard padding='65px' radius='5px 27px' data-aos="fade-up">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%'
                  }}
                >
                  <Box>
                    <Typography
                      variant="body1"
                      component='span'
                      sx={{
                        fontSize: '37px',
                        fontWeight: 800,
                        color: '#FF5C00',
                        lineHeight: '130.52%'
                      }}
                    >
                      Delight&nbsp;
                    </Typography>
                    <Typography
                      variant="body1"
                      component='span'
                      className="landing-gradient-text"
                      sx={{
                        fontSize: '37px',
                        fontWeight: 800,
                        lineHeight: '130.52%'
                      }}
                    >
                      your fans with 1-on-1 interactions
                    </Typography>
                    <Box sx={{ mt: 3 }} className='landing-subtitle'>
                      <Typography
                        className="landing-gradient-text"
                        variant="body1"
                        component='span'
                        sx={{
                          fontSize: '27px',
                          fontWeight: 600,
                          lineHeight: '130.52%'
                        }}
                      >
                        & substantially
                      </Typography>
                      <Typography
                        variant="body1"
                        component='span'
                        sx={{
                          fontSize: '27px',
                          fontWeight: 600,
                          color: '#FF5C00',
                          lineHeight: '130.52%'
                        }}
                      >
                        {" "}boost{" "}
                      </Typography>
                      <Typography
                        variant="body1"
                        component='span'
                        className="landing-gradient-text"
                        sx={{
                          fontSize: '27px',
                          fontWeight: 600,
                          lineHeight: '130.52%'
                        }}
                      >
                        your income with our 5-20 day auction
                      </Typography>
                      <Typography
                        variant="body1"
                        component='span'
                        sx={{
                          fontSize: '27px',
                          fontWeight: 600,
                          color: '#FF5C00',
                          lineHeight: '130.52%'
                        }}
                      >
                        {" "}+{" "}
                      </Typography>
                      <Typography
                        variant="body1"
                        component='span'
                        className="landing-gradient-text"
                        sx={{
                          fontSize: '27px',
                          fontWeight: 600,
                          lineHeight: '130.52%'
                        }}
                      >
                        giveaway campaigns
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <img src='images/icons/logo.png' alt='' />
                  </Box>
                </Box>
              </AnimateCard>
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
              <GradientRoundedBox sx={{ display: 'flex' }} radius='5px 27px'>
                <Image src='images/pages/landing/delight.jpg' alt='' />
              </GradientRoundedBox>
            </Grid>
          </Grid>
        </Stack>
        <GradientRoundedBox width={"100%"} sx={{ mt: 15 }} radius='27px'>
          <Grid container>
            <Grid item xs={12} sm={4} md={4}>
              <Image src='images/pages/landing/reward-left.jpg' alt='' />
            </Grid>
            <Grid item xs={12} sm={8} md={4} data-aos="fade-left">
              <AnimateCard padding='65px' radius='0px' reverse="true">
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="body1"
                      component='span'
                      className="landing-gradient-text"
                      sx={{
                        fontSize: '37px',
                        fontWeight: 800,
                        lineHeight: '130.52%'
                      }}
                    >
                      Let your fans be
                    </Typography>
                    <Typography
                      variant="body1"
                      component='span'
                      sx={{
                        fontSize: '37px',
                        fontWeight: 800,
                        color: '#FF5C00',
                        lineHeight: '130.52%'
                      }}
                    >
                      {" "}recognized
                    </Typography>
                    <Box sx={{ mt: 3 }} className='landing-subtitle'>
                      <Typography
                        className="landing-gradient-text"
                        variant="body1"
                        component='span'
                        sx={{
                          fontSize: '27px',
                          fontWeight: 600,
                          lineHeight: '130.52%'
                        }}
                      >
                        after spending countless hours watching you; they’ve
                      </Typography>
                      <Typography
                        variant="body1"
                        component='span'
                        sx={{
                          fontSize: '27px',
                          fontWeight: 600,
                          color: '#FF5C00',
                          lineHeight: '130.52%'
                        }}
                      >
                        &nbsp;grown with you&nbsp;
                      </Typography>
                      <Typography
                        variant="body1"
                        component='span'
                        className="landing-gradient-text"
                        sx={{
                          fontSize: '27px',
                          fontWeight: 600,
                          lineHeight: '130.52%'
                        }}
                      >
                        not only as a creator, but
                      </Typography>
                      <Typography
                        variant="body1"
                        component='span'
                        sx={{
                          fontSize: '27px',
                          fontWeight: 600,
                          color: '#FF5C00',
                          lineHeight: '140.52%',
                          display: 'block'
                        }}
                      >
                        &nbsp;as a person
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ width: '80px', position: 'relative' }}>
                    <img src='images/pages/landing/heart-round.png' alt='' className='landing-heart' />
                    <img src='images/pages/landing/gray-heart-round.png' alt='' className='landing-gray-heart' />
                  </Box>
                </Box>
              </AnimateCard>
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <Image src='images/pages/landing/reward-right.jpg' alt='' />
            </Grid>
          </Grid>
        </GradientRoundedBox>

        <Stack width={"100%"} sx={{ mt: 15 }}>
          <Grid container spacing={8} data-aos="fade-right">
            <Grid item xs={12} sm={8} md={8}>
              <GradientRoundedBox sx={{ display: 'flex' }} radius='5px 27px'>
                <Image src='images/pages/landing/loyal-fans.jpg' alt='' />
              </GradientRoundedBox>
            </Grid>
            <Grid item xs={12} sm={4} md={4} data-aos="fade-down">
              <AnimateCard padding='65px' radius='27px 5px'>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    pl: '3px'
                  }}
                >
                  <Box
                    sx={{
                      textAlign: 'right'
                    }}
                    className='landing-title'
                  >
                    <Typography
                      variant="body1"
                      component='span'
                      sx={{
                        fontSize: '37px',
                        fontWeight: 800,
                        color: '#FF5C00',
                        lineHeight: '130.52%'
                      }}
                    >
                      Your{" "}
                    </Typography>
                    <Typography
                      variant="body1"
                      component='span'
                      className="landing-gradient-text"
                      sx={{
                        fontSize: '37px',
                        fontWeight: 800,
                        lineHeight: '130.52%',
                      }}
                    >
                      hours,{" "}
                    </Typography>
                    <Typography
                      variant="body1"
                      component='span'
                      sx={{
                        fontSize: '37px',
                        fontWeight: 800,
                        color: '#FF5C00',
                        lineHeight: '130.52%'
                      }}
                    >
                      your{" "}
                    </Typography>
                    <Typography
                      variant="body1"
                      component='span'
                      className="landing-gradient-text"
                      sx={{
                        fontSize: '37px',
                        fontWeight: 800,
                        lineHeight: '130.52%',
                      }}
                    >
                      schedule
                    </Typography>
                    <Box sx={{ mt: 3 }} className='landing-subtitle'>
                      <Typography
                        variant="body1"
                        component='span'
                        className="landing-gradient-text"
                        sx={{
                          fontSize: '27px',
                          fontWeight: 600,
                          lineHeight: '130.52%',
                        }}
                      >
                        Get to know your fans for a few hours a week, over 1-2 months; flexibly choose your availability
                        week-by-week, and we’ll match you with fans who have won an interaction in the campaign
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <img src='images/icons/logo.png' alt='' />
                  </Box>
                </Box>
              </AnimateCard>
            </Grid>
          </Grid>
        </Stack>
        <Box sx={{ width: '80%' }}>
          <VideoContainer mt={23} mb={13}>
            <iframe
              title='youtube'
              src='https://www.youtube-nocookie.com/embed/sIeYrczzcvc'
              allowFullScreen
            />
          </VideoContainer>
        </Box>
        <Stack direction="column" alignItems="center" mb={13}>
          <InteractFlashyButton
            radius='5px 23px'
            onClick={() => navigate('/a/what-is-interact')}
            aos="fade-up"
          >
            <Typography sx={{ fontSize: "24px", px: 4, fontWeight: 500, lineHeight: '151.02%', color: '#FFEDF8' }}>
              Start a campaign
            </Typography>
          </InteractFlashyButton>

          <Typography sx={{ my: 2, fontSize: "20px", textAlign: "center", color: '#A79BBB', lineHeight: '36px' }}>
            Get started for free, create a campaign in under half an hour
          </Typography>
        </Stack>

        <GradientRoundedBox sx={{ mb: '120px', display: 'flex', overflow: 'hidden' }}>
          <Box>
            <img
              src='images/pages/landing/interact.jpg'
              alt=''
              className='landing-h-100'
            />
          </Box>
          <Box sx={{ p: 8, flex: 1 }}>
            <Typography fontSize={"36px"} color={"#782FEE"} fontWeight={"700"} >
              What can you earn with interact?
            </Typography>
            <Typography
              mt='30px'
              fontSize={"26px"}
              fontWeight={"400"}
              color={"#4D4657"}
              data-aos="fade-down"
              sx={{ '& > span': { fontWeight: 600 } }}
            >
              Earn<span> $5K to $7K per campaign </span>
              with around 1000 loyal fans who spend only a few dollars, in exchange for ~50 hours of interactions.
            </Typography>
            <Typography
              mt={1}
              fontSize={"24px"}
              color={"#70677E"}
              fontWeight={"400"}
              data-aos="fade-down"
              sx={{ '& > span': { fontWeight: 500 } }}
            >
              Campaigns reserve interactions for 2 months usually (a few hours of getting to know fans each week), so 5 campaigns = 10 months of interactions, generating
              <span> $25K to $35K</span> annually.
            </Typography>
            <Typography
              mt={4}
              fontSize={"26px"}
              fontWeight={"500"}
              color={"#4D4657"}
              data-aos="fade-up-left"
              sx={{ '& > span': { textDecoration: "underline", fontWeight: 700 } }}
            >
              <span>Extra income </span>with
              <span> no opportunity cost</span>
            </Typography>
            <Typography
              mt={1} 
              fontSize={"24px"} 
              color={"#70677E"}
              data-aos="fade-down"
            >
              You’ll get fresh content for your stream, and your streaming schedule can stay
              the same without additional hours. You can even make use of highlights from
              interactions to spice up new videos.
            </Typography>
          </Box>
        </GradientRoundedBox>

        <Stack width={"100%"}>
          <Grid container spacing={3}>
            {blockList.map(data => (
              <FeatureCard key={data.id} data={data} />
            ))}
          </Grid>
        </Stack>

        <Stack width={"100%"} sx={{ mt: 15 }}>
          <Grid container spacing={10}>
            <Grid item xs={12} sm={6} md={6}>
              <Typography
                variant='h3'
                component='h2'
                sx={{ fontWeight: 600, fontSize: "32px", color: "#4D4657", lineHeight: '46px' }}
              >
                Together, you can:
                <Box
                  className='landing-game-border'
                  sx={{ pl: 5, mt: 5 }}
                >
                  <Box data-aos="fade-right" data-aos-duration="1000">
                    <Typography
                      fontSize={"26px"}
                      color={"#70677E"}
                      fontWeight={"400"}
                      sx={{ '& > :not(.MuiTypography-body1)': { fontWeight: 700, color: "#782FEE" } }}
                    >
                      <span>Play games:{" "}</span>
                      <Typography
                        variant="body1"
                        component="span"
                        fontSize={"26px"}
                        color={"#3D3649"}
                        fontWeight={"400"}
                      >F</Typography>rom competitive games like Valorant & Chess to.... GeoGuessr
                      or mini putt in Discord activities
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }} data-aos="fade-left">
                    <Typography
                      fontSize={"26px"}
                      color={"#70677E"}
                      fontWeight={"400"}
                      sx={{ '& > span': { fontWeight: 700, color: "#782FEE" } }}
                    >
                      <span>Have interesting discussions:{" "}</span>
                      Discussing topics fans are passionate about, commentating, and
                      learning from each other (fans can screen share: they might
                      show off their own creations, favorite clips of your content
                      and ask for advice in your field of expertise… or just anime.
                      You could also spice it up with a Try Not to Laugh challenge,
                      watching funny YouTube videos via Discord activities)
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }} data-aos="fade-right">
                    <Typography
                      fontSize={"26px"}
                      color={"#70677E"}
                      fontWeight={"700"}
                      sx={{
                        backgroundcolor: "primary",
                        backgroundImage: `linear-gradient(90.29deg, #782FEE 0.11%, #DD00FF 9.16%)`,
                        backgroundSize: "100%",
                        backgroundRepeat: "repeat",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Interact!
                    </Typography>
                  </Box>
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <img
                src='images/pages/landing/together.png'
                alt=''
                loading="lazy"
                className='landing-w-100'
                data-aos="fade-left"
                data-aos-duration="1000"
              />
            </Grid>
          </Grid>
        </Stack>

        <Stack width={"100%"} sx={{ mt: 15 }}>
          <Accordion
            className='landing-accordion'
            sx={{
              px: 6,
              py: 4,
              boxShadow: "0px 0px 27px 7px rgba(120, 47, 238, 0.15)"
            }}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              expandIcon={<ArrowDropUpRoundedIcon color="primary" sx={{ fontSize: '60px' }} />}
            >
              <Typography
                fontSize={"36px"}
                color={"#782FEE"}
                fontWeight={"700"}
              >
                How it works
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ width: { sm: '45%' } }}>
                  <Typography fontSize={"21px"} sx={{ '& > span': { fontWeight: 700 } }}>
                    💜&nbsp;Content creators <span>start a time-limited campaign </span>
                    (lasting 10 days, by default) with a goal, offering <span>1-on-1
                      interactions to fans </span>(eg. play a game, chatting <span>via Discord
                        or Google Meet</span>) that are <span>scheduled in the 10 weeks (by
                          default) after the campaign ends.</span>
                  </Typography>
                  <Typography fontSize={"21px"} sx={{ '& > span': { fontWeight: 700 } }}>
                    💜&nbsp;Fans try to be selected via the <span>giveaway </span>(with a
                    <span> free entry option</span>) or the <span>auction </span>(be a top bidder on the
                    leaderboard; pricier but a guaranteed interaction).  Fans pay immediately for the giveaway;
                    meanwhile in the auction, fans only pay if they win (charged at the end of the campaign).
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography fontSize={"21px"}>
                    💜&nbsp;When new fans try to enter the auction/giveaway,
                    they have to create an account & input their general
                    availability from Mon-Sun (editable on profile).
                  </Typography>
                  <Typography fontSize={"21px"} sx={{ '& > span': { fontWeight: 700 } }}>
                    💜&nbsp;After the campaign ends,<span> selected fans (winners)
                      will have interactions assigned to them over the
                      interaction window duration, </span>10 weeks by default
                    (with auction winners having priority).
                  </Typography>
                  <Typography fontSize={"21px"} sx={{ '& > span': { fontWeight: 700 } }}>
                    💜&nbsp;The content creator<span> selects when they are available
                      week-by-week </span>(creators have to lock in their availability by
                    Friday midnight (EST) for the next week, and can<span> sync with
                      their personal Google, Outlook or iCloud calendars</span>); from this,
                    <span>with our matching algorithm, interactions are scheduled.</span>
                  </Typography>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
        <Stack direction="column" alignItems="center" sx={{ pt: 14 }}>
          <InteractFlashyButton
            radius={"5px 23px"}
            aos="fade-up"
            onClick={() => navigate('/a/what-is-interact')}
          >
            <Typography sx={{ fontSize: "24px", px: 4, fontWeight: 500, lineHeight: '151.02%', color: '#FFEDF8' }}>
              Create a campaign now!
            </Typography>
          </InteractFlashyButton>
          <Typography sx={{ mt: 2, mb: 5, fontSize: "20px", textAlign: "center", color: '#A79BBB', lineHeight: '36px' }}>
            Get started for free, create a campaign in under half an hour
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LandingPage;
