import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import TimerCountdown from 'react-native-timer-countdown';
import { GREEN_COLOR, BLACK_COLOR, WHITE_COLOR } from '../../ColorHexa';

export default class Quiz extends Component {
	static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.name,
        headerStyle: {
            backgroundColor: BLACK_COLOR,
        },
        headerTitleStyle: {
            color: WHITE_COLOR,
        },
    });

	constructor(props) {
		super(props);
		//console.log(props);
	}

	render() {
		return (
			<View style={styles.container}>
		        <Swiper
		        	ref={swiper => {
			        	this.swiper = swiper
			        }}
		            cards={this.props.navigation.state.params.questions}
		            renderCard={(question) => {
		                return (
		                    <View style={styles.questionCard}>
		                    	<Image style={styles.questionImage} source={question.image} />
		                    	<Text style={styles.questionText} >{question.description}</Text>
		                    	<View style={styles.questionChoicesContainer}>
		                    		<TouchableOpacity 
		                    			style={styles.questionChoiceButton} 
		                    			onPress={()=> {console.log('0 has chosen!')}}>
		                    			<Text style={styles.questionChoiceButtonText}>
		                    			{question.choices[0]}
		                    			</Text>
		                    		</TouchableOpacity>
		                    		<TouchableOpacity 
		                    			style={styles.questionChoiceButton} 
		                    			onPress={()=> {console.log('2 has chosen!')}}>
		                    			<Text style={styles.questionChoiceButtonText}>
		                    			{question.choices[2]}
		                    			</Text>
		                    		</TouchableOpacity>
		                    	</View>
		                    	<View style={styles.questionChoicesContainer}>
		                    		<TouchableOpacity 
		                    			style={styles.questionChoiceButton} 
		                    			onPress={()=> {console.log('1 has chosen!')}}>
		                    			<Text style={styles.questionChoiceButtonText}>
		                    			{question.choices[1]}
		                    			</Text>
		                    		</TouchableOpacity>
		                    		<TouchableOpacity 
		                    			style={styles.questionChoiceButton} 
		                    			onPress={()=> {console.log('3 has chosen!')}}>
		                    			<Text style={styles.questionChoiceButtonText}>
		                    			{question.choices[3]}
		                    			</Text>
		                    		</TouchableOpacity>
		                    	</View>
		                    </View>
		                )
		            }}
		            onSwiped={(cardIndex) => {console.log(cardIndex)}}
		            onSwipedAll={() => {console.log('onSwipedAll')}}
		            horizontalSwipe={false}
		            verticalSwipe={false}
		            cardIndex={0}
		            backgroundColor={GREEN_COLOR}>
		        </Swiper>
		    </View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	questionCard: {
	    flex: 1,
	    borderRadius: 4,
	    borderWidth: 2,
	    borderColor: '#E8E8E8',
	    backgroundColor: WHITE_COLOR,
	    flexDirection: 'column',
	    justifyContent: 'center',
	    alignItems: 'center'
	},
	questionImage: {
		height: 150,
	},
	questionText: {
		fontSize: 25,
		marginTop: 16,
		marginBottom: 16,
	},
	questionChoicesContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	questionChoiceButton: {
		margin: 10,
		paddingLeft: 32,
		paddingRight: 32,
		paddingTop: 16,
		paddingBottom: 16,
		backgroundColor: GREEN_COLOR,
	},
	questionChoiceButtonText: {
		color: WHITE_COLOR,
		fontSize: 20,
	},

});