import React from "react";

const PageSwitcher = ({ current_page, total_pages }) => {
    const PageButtons = () => {
        current_page += 1 // this is because human's expect pages to be 1-indexed
        let middle_page = current_page

        if (current_page >= total_pages) { middle_page = total_pages - 1 }
        if (current_page <= 1) { middle_page = 2}
        const page_numbers = [middle_page - 1, middle_page, middle_page+1]


        const pageItemList =  page_numbers.map((number) => {
            return (
                <li className="page-item" key={number}>
                    <a className={number === current_page ? "page-link disabled": "page-link"} href={"#"}>
                        {number}
                    </a>
                </li> 
            )
        })

        const arrowList = [
            {text: "<<", href: "#", disabledPage: 1},
            {text: "<", href: "#", disabledPage: 1}, 
            {text: ">", href: "#", disabledPage: total_pages}, 
            {text: ">>", href: "#", disabledPage: total_pages}, 
        ]

        const arrowItemList = arrowList.map((arrow) => {
            return (
                <li className="page-item" key={arrow.text}>
                    <a className={arrow.disabledPage === current_page ? "page-link disabled": "page-link"} href={arrow.href}>
                        {arrow.text}
                    </a>
                </li> 
            )
        })
        
        return [...arrowItemList.slice(0, 2), ...pageItemList, ...arrowItemList.slice(2)]
    }

    return (
        <section id="page_switcher_section" className="container mt-4">
            <div id="page_switcher_container" className="container">
                <nav>
                    <ul className="pagination justify-content-center">
                        {PageButtons()}
                    </ul>
                </nav>
            </div>
        </section>
    );
};

export default PageSwitcher