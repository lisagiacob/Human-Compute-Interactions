import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import API from '../services/API';

import { useUser } from './UserContext';

interface Photo {
    created_at: string;
    number_of_b: number;
    path: string;
    skincare_id: number;
    username: string;
}

interface PhotosHistoryProps {
    user: { username: string; pfp_id: number }; // Simplified User Type
}

interface AnimatedCardProps {
    item: Photo;
    index: number;
    scrollY: SharedValue<number>;
}

function AnimatedCard({ item, index, scrollY }: AnimatedCardProps) {
    const stylez = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [
                    (index - 2) * 250, // Below lower opacity
                    (index - 1) * 250, // Slightly above full opacity
                    index * 250,       // Full opacity
                    (index + 1) * 250, // Slightly below full opacity
                    (index + 2) * 250, // Above lower opacity
                ],
                [0.3, 1, 1, 1, 0.3], // Corresponding opacity values
            ),
        };
    });
    console.log(item);
    return (
        <Animated.View style={[{ 
                flex: 1, 
                height: 250, 
                margin: 5, 
                padding: 10, 
                backgroundColor: 'white', 
                borderRadius: 7, 
                borderWidth: 2,
                borderColor: 'rgba(111, 88, 201, 1)',
            }, stylez]}>
            <Image source={{ uri: item.path }} style={[StyleSheet.absoluteFillObject, { borderRadius: 4 }]} blurRadius={60}/>
            <Image source={{ uri: item.path }} style={{ width: '100%', height: '85%', resizeMode: 'cover', borderRadius: 7 }} />
            <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff', marginTop: 5 }}>{item.created_at?.slice(0,10)}  {item?.skincare_id !== null ? 'SC.' + item?.skincare_id : null}</Text>
                <Text style={{ fontSize: 13, fontWeight: '800' ,color: '#fff', marginTop: 2 }}>Number of pimples: { item.number_of_b }</Text>
            </View>
        </Animated.View>
    );
}

export default function PhotosHistory({ user }: PhotosHistoryProps) {
    const { loggedInUser } = useUser();
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        API.getPhotosByUser(loggedInUser.username)
            .then((photos) => {
                const sortedPhotos = photos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setPhotos(sortedPhotos);
            })
            .catch((error) => {
                console.error('Error fetching photos:', error);
            });
    }, [loggedInUser.id]);

    const scrollY = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler(e => {
        scrollY.value = e.contentOffset.y;
    });

    if (photos.length === 0) {
        return (
            <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>No photos yet. Any photos you take will appear here!</Text>
            </View>
        );
    }

    return (
        <Animated.FlatList
            data={photos}
            keyExtractor={(item) => item.created_at}
            contentContainerStyle={{ 
                paddingHorizontal: 5,
                paddingVertical: 5, 
            }}
            renderItem={({ item, index }) => <AnimatedCard item={item} index={index} scrollY={scrollY}/>}
            snapToInterval={260}
            decelerationRate="fast"
            onScroll={onScroll}
            scrollEventThrottle={16}
        />
    );
}

const styles = StyleSheet.create({
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    placeholderText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
});