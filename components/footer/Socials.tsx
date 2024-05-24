import { FaMeta, FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Socials() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-5 my-4 text-xl'>
				<a
					target='_blank'
					rel='noopener noreferrer'
					href='https:\\www.meta.com\ca'
				>
					<FaMeta />
				</a>
				<a
					target='_blank'
					rel='noopener noreferrer'
					href='https://ca.linkedin.com/'
				>
					<FaLinkedin />
				</a>
				<a
					target='_blank'
					rel='noopener noreferrer'
					href='https://www.instagram.com/'
				>
					<FaInstagram />
				</a>
				<a target='_blank' rel='noopener noreferrer' href='https://x.com/'>
					<FaXTwitter />
				</a>
			</div>
  )
}
