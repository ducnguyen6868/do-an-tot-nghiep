import { Icon } from '@iconify/react';

export default function CheckInModal({point ,onClose}) {
    return (
        <>
            <h3 className="checkin-success-title">
                <span style={{ marginRight: "8px" }}>Check-in Successful!</span>
                <Icon icon="noto:party-popper" width="50" height="50" />
            </h3>
            <div className="checkin-points-earned">+{point?.table[point.streak]||0} Points</div>
            <div className="checkin-calendar">
                {point.table?.map((points, index) => (
                    <div key={index} className={`checkin-day ${index <point.streak ? 'completed' : index ===(point.streak+1) ? 'today' : ''}`}>
                        <div className="day-number">Day {index + 1}</div>
                        <div className="day-icon">{index <(point.streak+1) ? '✓' : index ===(point.streak+1) ? '⭐' : '○'}</div>
                        <div className="day-points">{points} pts</div>
                    </div>
                ))}
            </div>
            <div className="checkin-streak-info">
                <span className="streak-text">Current Streak: {point.streak+1} days</span>
                <span className="streak-next">Next: {point.table[point.streak] || 'Complete!'} pts</span>
            </div>
            <button className="modal-btn" onClick={() => onClose()}>Got it!</button>
        </>
    )
}