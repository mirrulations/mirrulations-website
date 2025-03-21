import React from "react";

const PageSwitcher = () => {
    return (
        <section id="page_switcher_section" className="container mt-4">
            <div id="page_switcher_container" className="container">
                <nav>
                    <ul className="pagination justify-content-center">
                        <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                        <li class="page-item"><a class="page-link" href="#">Next</a></li>
                    </ul>
                </nav>
            </div>
        </section>
    );
};

export default PageSwitcher