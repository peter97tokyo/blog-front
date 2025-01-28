import React from 'react';

import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/components/user/global.css';

function Header(){
    return(
        <header className="header">
            <div className="container d-flex justify-content-between align-items-center">
                <nav>
                    <ul className="nav-list">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/">About</Link></li>
                        <li><Link to="/">Contents</Link></li>
                    </ul>
                </nav>
                <h1 className="logo">BLOG</h1>
            </div>
        </header>

    )
}

export default Header