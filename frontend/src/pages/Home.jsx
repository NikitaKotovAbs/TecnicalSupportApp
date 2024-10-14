import {useEffect, useState} from "react";
import axios from "axios";
import TicketStore from "../data/TicketStore.js"

export default function Home() {
    // const {/** @type {Ticket[]} */ tickets, addTicket, updateTicket, removeTicket, setTickets} = TicketStore()
    // const url = "http://127.0.0.1:8000/"
    // const [data, setData] = useState()
    //
    // useEffect(() => {
    //     axios.get(url + "api/tickets/")
    //         .then(response => {
    //             console.log(response.data);
    //             setTickets(response.data.results)
    //         })
    //         .catch(error => console.error(error.message))
    // }, []);

    return (
        <>
            <h1 className="text-red-600">Test Text TailWind</h1>
            {
                tickets ?
                    <p key={tickets[0]?.id}>{tickets[0]?.title}</p>
                    : "Не загруженно"
            }
        </>
    )
}