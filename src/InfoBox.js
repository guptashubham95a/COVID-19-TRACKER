import { Card, CardContent } from '@material-ui/core';
import { Typography } from 'antd';
import React from 'react'

function InfoBox({title,cases,total}) {
    return (
    <Card>
    <CardContent>
        {/* Title Coronavirus case */}
        <Typography className="infoBox__title" color="textSecondary">
            {title}
        </Typography>
        {/* +120K number of cases */}
        <h2 className="infoBox__cases">{cases}</h2>
        {/* 1.2M Total */}
        <Typography className="infoBox__total" color="textSecondary">
        {total} Total
        </Typography>
    </CardContent>
    </Card>
        )
}

export default InfoBox;
