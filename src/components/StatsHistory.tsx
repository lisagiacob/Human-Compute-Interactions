import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AvgChart } from './AvgChart';
import PimpleChart from './PimpleChart';

import { useUser } from './UserContext';

import API from '../services/API';

type lastPimplesSC = {
    date: string;
    number_of_b: number;
};

export default function StatsHistory() {
    const { loggedInUser } = useUser();
    const [pimplesChartVisible, setPimplesChartVisible] = useState(false);
    const [avgPimplesSC, setAvgPimplesSC] = useState([]);
    const [lastPimplesSC, setLastPimplesSC] = useState<lastPimplesSC[]>([]);
    
    // Separate loading states for both API calls
    const [loadingAvg, setLoadingAvg] = useState(true); 
    const [loadingLastSC, setLoadingLastSC] = useState(true); 

    useEffect(() => {
        setLoadingAvg(true); // Set loading state to true for avgPimplesSC API call
        API.getAvgPimples(loggedInUser.username)
            .then((data) => {
                setAvgPimplesSC(data);
                setLoadingAvg(false); // Set loading to false once avg data is fetched
            })
            .catch((error) => {
                console.error('Error fetching mean value:', error);
                setLoadingAvg(false); // Set loading to false on error as well
            });
    }, [loggedInUser.username]);

    useEffect(() => {
        setLoadingLastSC(true); // Set loading state to true for lastPimplesSC API call
        API.getLastSCData(loggedInUser.username)
            .then((data) => {
                setLastPimplesSC(data);
                setLoadingLastSC(false); // Set loading to false once last skincare data is fetched
            })
            .catch((error) => {
                console.error('Error fetching last value:', error);
                setLoadingLastSC(false); // Set loading to false on error as well
            });
    }, [loggedInUser.username]);

    console.log('lastPimplesSC:', lastPimplesSC.length);

    // Fake Data for testing
    const fakeData2 = [
        { skincare: 1, npimples: 5, date: 'Jan 1' },
        { skincare: 1, npimples: 3, date: 'Jan 2' },
        { skincare: 1, npimples: 8, date: 'Jan 3' },
        { skincare: 1, npimples: 0, date: 'Jan 4' },
        { skincare: 1, npimples: 6, date: 'Jan 5' },
        { skincare: 1, npimples: 4, date: 'Jan 6' },
        { skincare: 1, npimples: 7, date: 'Jan 7' },
        { skincare: 1, npimples: 3, date: 'Jan 8' },
    ];

    const avgPimples = lastPimplesSC.reduce((acc, curr) => acc + curr?.number_of_b, 0) / fakeData2.length;
    const lastPimples = lastPimplesSC[lastPimplesSC.length - 1]?.number_of_b;

    useEffect(() => {
        // Ensure the chart becomes visible after the component mounts.
        setPimplesChartVisible(true);
    }, []);

    return (
        <View style={styles.container}>
            {(loadingAvg || loadingLastSC) ? ( // Render loading state until both data sets are available
                <ActivityIndicator size="large" color="rgba(66, 3, 61, 1)" />
            ) : (
                <>
                    <Text style={styles.label}>
                        Average Pimples for Skincare Routine
                    </Text>
                    <View style={styles.avgchart}>
                        <AvgChart data={avgPimplesSC} />
                    </View>
                    <Text style={[styles.label, { paddingTop: 4 }]}>
                        Current Skincare Routine
                    </Text>
                    <View key={'PimpleChart'} style={styles.pimpleschart}>
                        {lastPimplesSC.length !== 0 ? (
                            <Text style={[styles.label, { paddingTop: 0, marginTop: 6, fontSize: 12 }]}>
                                Pimples last time {lastPimples} vs. Average {avgPimples}
                            </Text>  
                        ):(
                            <Text style={[styles.label, { paddingTop: 0, marginTop: 6, fontSize: 12 }]}>
                                No data available for comparison
                            </Text>
                        )}
                        {lastPimplesSC.length !== 0  ?(
                            <View>
                                <Text style={[ styles.label, { fontSize: 10 } ]}>From {lastPimplesSC[0].date.slice(0,10)}</Text>
                                <Text style={[ styles.label, { fontSize: 10, marginBottom: 0 } ]}>to {lastPimplesSC[lastPimplesSC.length - 1].date.slice(0,10)}</Text>
                            </View>
                        ):(
                            <></>
                        )}
                        <PimpleChart data={lastPimplesSC} />
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(182, 184, 214, 0.75)',
        height: '70%',
        width: 250,
        borderRadius: 7,
        zIndex: 10,
        borderWidth: 3,
        borderColor: 'rgba(111, 88, 201, 1)',
        marginRight: 4,
    },
    label: {
        marginTop: 7,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(66, 3, 61, 1)',
        textAlign: 'center',
    },
    avgchart: {
        alignItems: 'center',
        marginTop: 10,
        height: '35%',
        width: '92%',
        borderRadius: 7,
        backgroundColor: 'rgba(133, 71, 152, 0.75)',
        borderWidth: 3,
        borderColor: 'rgba(111, 88, 201, 1)',
    },
    pimpleschart: {
        alignItems: 'center',
        marginTop: 10,
        height: '45%',
        width: '92%',
        borderRadius: 7,
        backgroundColor: 'rgba(133, 71, 152, 0.75)',
        borderWidth: 3,
        borderColor: 'rgba(111, 88, 201, 1)',
    },
});
