'use client';

import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdOutlineMenu } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa6';

import { HEADER_LINKS } from '@/lib/constants';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTriggerMenu,
} from '@/components/ui/select';
import LoggedOutButtons from './LoggedOutButtons';
import { useAppSelector } from '@/lib/store/store';
import LoggedInButtons from './LoggedInButtons';

export default function Header() {
	const [openMobileMenu, setOpenMobileMenu] = useState(false);
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const { loggedIn } = useAppSelector((state) => state.user);
	const router = useRouter();

	const toggleMobileMenu = () => {
		setOpenMobileMenu((prev) => !prev);
	};

	const handleMenuLink = (link: string, type: string) => {
		if (type === 'mobile') {
			toggleMobileMenu();
		}
		router.push(link);
	};

	const handleNavButton = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(e);
		if (e.currentTarget) {
			const target = e.currentTarget;
			console.log(target);
			let x = target.getAttribute('aria-expanded');
			x = x === 'false' ? 'true' : 'false';
			console.log({ x });
			target.setAttribute('aria-expanded', x);
		}
	};
	const handleNavClick = (e: React.MouseEvent<HTMLLIElement>) => {
		if (e.currentTarget) {
			e.currentTarget.blur();
			console.log(e.currentTarget);
		 }

	}
	const handleCloseDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (e.currentTarget) {
			const target = e.currentTarget;
			target.setAttribute('aria-expanded', 'false');
		}
	};

	useEffect(() => {
		setUserLoggedIn(loggedIn);
	}, [loggedIn]);

	useEffect(() => {
		window.addEventListener('resize', () => {
			setOpenMobileMenu(false);
		});
		return window.removeEventListener('resize', () => {});
	}, []);

	return (
		<header>
			<p className='text-2xl font-semibold text-bank-green'>
				<Link href='/'> MBank</Link>
			</p>
			<nav className='hidden sm:flex items-center gap-5 h-[60px]'>
				{userLoggedIn ? <LoggedInButtons /> : <LoggedOutButtons />}
				<ul className='header-nav-ul h-[60px] text-sm'>
					{HEADER_LINKS.map(({ title, link, subsection }) => (
						<Fragment key={title}>
							{link ? (
								<li className='h-full flex items-center hover:text-bank-green'>
									<Link href={link}>{title}</Link>
								</li>
							) : (
								<li
									key={title}
									className='header-sub-menu'
										onClick={(e) => e.currentTarget.classList.toggle('active')}
										onMouseEnter={(e) => e.currentTarget.classList.add('active')}
										onMouseLeave={(e) => e.currentTarget.classList.remove('active')}
								>
									<span className='flex items-center gap-2'>
										{title} <FaChevronDown />
									</span>
									<ul className='header-sub-menu-ul'>
										{subsection.map(({ label, link, icon }) => (
											<li key={label} className='my-2'>
												<Link href={link} className='header-sub-menu-item'>
													{label}
												</Link>
											</li>
										))}
									</ul>
								</li>
							)}
						</Fragment>
					))}
				</ul>
			</nav>
			<nav className='block sm:hidden'>
				<Sheet open={openMobileMenu} onOpenChange={toggleMobileMenu}>
					<SheetTrigger>
						<MdOutlineMenu size={30} />
					</SheetTrigger>
					<SheetContent className='pt-8 min-w-60 max-w-sm flex flex-col justify-between'>
						<div>
							<p className='text-2xl font-semibold mb-4 text-bank-green'>
								Moods Bank
							</p>
							{HEADER_LINKS.map(({ title, subsection, link }) => (
								<div key={title}>
									{link ? (
										<p
											className='h-10 flex items-center cursor-pointer mobile-menu-item'
											onClick={() => handleMenuLink(link, 'mobile')}
										>
											{title}
										</p>
									) : (
										<Select
											onValueChange={(value) => handleMenuLink(value, 'mobile')}
										>
											<SelectTriggerMenu className='mobile-menu-trigger mb-4'>
												{title}
											</SelectTriggerMenu>
											<SelectContent>
												{subsection.map(({ label, link, icon }) => (
													<SelectItem
														key={label}
														value={link}
														className=' mobile-header-sub-menu-item'
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								</div>
							))}
						</div>
						<div>
							{userLoggedIn ? (
								<LoggedInButtons changeFunction={toggleMobileMenu} />
							) : (
								<LoggedOutButtons />
							)}
						</div>
					</SheetContent>
				</Sheet>
			</nav>
		</header>
	);
}
