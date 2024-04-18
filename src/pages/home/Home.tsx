import { EmailEditor } from "../../components/email-editor/EmailEditor";
import { EmailList } from "../../components/email-list/EmailList";
import { LifeQueue } from "../../components/life-queue/LifeQueue";


export function Home() {
    return <div className="" style={{
        display: 'flex',
        flexDirection: 'column',
    }}>
        <div className="" style={{
            padding: '20px'}}>
                        <h1 >Умная очередь</h1>
            </div>
        <div style={{
        display: 'flex',
        justifyContent: "space-around",
    }}>
                <div style={{
                display: 'flex',
                gap: '60px'
            }}>
            <EmailEditor/>
            <LifeQueue/>
        </div>
        <EmailList/>
    </div>
    </div>
}