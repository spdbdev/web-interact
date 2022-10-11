import './Socials.css';

import youtube from './youtube.png';
import twitch from './twitch.png';
import discord from './discord.png';
import tiktok from './reddit.png';
import twitter from './twitter.png';
import facebook from './facebook.png';
import instagram from './instagram.png';
import hyperlink from './copy.png';
import message from './message.png';
import reddit from './reddit.png';


function Socials({type}) {
    // console.log(type)
    let logo = youtube;
    let link = 'youtube.com';
    switch (type){
        case 'youtube':
            logo = youtube;
            link = 'https://www.youtube.com/';
            break;
        case 'twitch':
            logo = twitch;
            link = 'https://www.twitch.com';
            break;
        case 'discord':
            logo = discord;
            link = 'https://www.discord.com';
            break;
        case 'tiktok':
            logo = tiktok;
            link = 'https://www.tiktok.com';
            break;
        case 'twitter':
            logo = twitter;
            link = 'https://www.twitter.com';
            break;
        case 'instagram':
            logo = instagram;
            link = 'https://www.instagram.com';
            break;
        case 'facebook':
            logo = facebook;
            link = 'https://www.facebook.com';
            break;
        case 'hyperlink':
            logo = hyperlink;
            link = 'https://www.google.com';
        case 'reddit':
            // console.log('reddit ran')
            logo = reddit;
            link = 'https://www.youtube.com';
        default:
            logo = hyperlink;
            link = 'https://www.youtube.com';
            break;
    }

  return (
    <div className='SocialsContainer' onClick={()=>{window.open(link)}}>
        <img src={logo} style={{height:'100%', width:'100%'}}/>
    </div>
  );
}

export default Socials;
