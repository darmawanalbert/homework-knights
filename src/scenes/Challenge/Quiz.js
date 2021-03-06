import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	Animated,
	Alert
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import TimerCountdown from 'react-native-timer-countdown';
import { GREEN_COLOR, BLACK_COLOR, WHITE_COLOR } from '../../ColorHexa';
import MS from '../Styles';
import { incrementGold, removeQuestion, fetchChallenges } from '../../services';

export default class Quiz extends Component {
	static navigationOptions = ({navigation}) => ({
		title: navigation.state.params.name,
        headerStyle: [
            MS.headerStyle, 
			MS.headerShadowlessStyle,
		],
		headerTintColor: WHITE_COLOR,
        headerRight: (
        	<View
        		style={{
        			flex: 1,
					marginRight: 15,
					alignItems: 'center',
					flexDirection: 'row',
        		}}>
				<Image
					source={require('../../assets/gold.png')}
					style={{
						width: 30,
						height: 30,
						marginRight: 5,
					}} />
        		<Text
					style={{
						color: WHITE_COLOR,
						fontSize: 20,
						alignSelf: 'center',
						justifyContent: 'center',
					}}>
					{navigation.state.params.userGolds}
				</Text>
        	</View>
        )

    });

	constructor(props) {
		super(props);
		this.state = {
			fadeAnimCorrect: new Animated.Value(0),
			fadeAnimWrong: new Animated.Value(0),
			currentTimeRemaining: this.props.navigation.state.params.questions[0].duration,
			fadeAnimGold: new Animated.Value(0),
			getGold: 0,
			currentIndex: 0
		};
	};

	componentWillUnmount() {
		if(this.state.currentIndex<this.props.navigation.state.params.questions.length)
			removeQuestion(this.props.navigation.state.params.questions[this.state.currentIndex]);
		fetchChallenges(this.props.navigation.state.params.refreshCallback);
	}

	onAllSwipedHandler = ()=> {
		this.setState({
			currentTimeRemaining: 0,
		});
		Alert.alert(
			'No More Question',
			'We have no more question for you, at least for now!', 
			[
				{
					text: 'Ok',
					onPress: ()=> {this.props.navigation.goBack()}
				}
			]
		);
	};

	onSwipeLeftMechanism = ()=> {
		Animated.sequence([
			Animated.timing(this.state.fadeAnimWrong, {toValue: 1, duration: 100}),
			Animated.timing(this.state.fadeAnimWrong, {toValue: 0, duration: 100}),
		]).start();
		this.swiper.swipeLeft();
		this.setState({
			currentTimeRemaining: this.props.navigation.state.params.questions[this.state.currentIndex].duration,
		});
	};

	onSwipeRightMechanism = ()=> {
		Animated.sequence([
			Animated.timing(this.state.fadeAnimCorrect, {toValue: 1, duration: 100}),
			Animated.timing(this.state.fadeAnimCorrect, {toValue: 0, duration: 100}),
		]).start();
		this.swiper.swipeRight();
		this.setState({
			currentTimeRemaining: this.props.navigation.state.params.questions[this.state.currentIndex].duration,
		});
	};

	onAnswered = (choiceIndex, correctAnswerIndex, golds)=> {
		if (choiceIndex === correctAnswerIndex) {
			this.onSwipeRightMechanism();
			incrementGold(golds);
			this.props.navigation.setParams({
				userGolds: this.props.navigation.state.params.userGolds+golds,
			});
			this.setState({ getGold: golds });
            Animated.sequence([
                Animated.timing(
                  this.state.fadeAnimGold,
                  {
                    toValue: 1,
                    duration: 100,
                  }
                ),
                Animated.timing(
                  this.state.fadeAnimGold,
                  {
                    toValue: 0,
                    duration: 1000,
                  }
                ),
            ]).start();
		}
		else {
			this.onSwipeLeftMechanism();
		}
	};

	onTimeOutHandler = () => {
		if(this.state.currentIndex < this.props.navigation.state.params.questions.length)
			this.onSwipeLeftMechanism();
	};

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
		                    <View style={[
								styles.questionCard,
							]}>
								{	question.image &&
		                    		<Image style={styles.questionImage} source={{uri: question.image}} />
								}
		                    	<Text style={styles.questionText}>{question.description}</Text>
		                    	<View style={styles.questionChoicesContainer}>
		                    		<TouchableOpacity 
		                    			style={styles.questionChoiceButton} 
		                    			onPress={()=> {this.onAnswered(0,question.answerIndex, question.golds)}}>
		                    			<Text style={styles.questionChoiceButtonText}>
		                    			{question.choices[0]}
		                    			</Text>
		                    		</TouchableOpacity>
		                    		<TouchableOpacity 
		                    			style={styles.questionChoiceButton} 
		                    			onPress={()=> {this.onAnswered(2,question.answerIndex, question.golds)}}>
		                    			<Text style={styles.questionChoiceButtonText}>
		                    			{question.choices[2]}
		                    			</Text>
		                    		</TouchableOpacity>
		                    	</View>
		                    	<View style={styles.questionChoicesContainer}>
		                    		<TouchableOpacity 
		                    			style={styles.questionChoiceButton} 
		                    			onPress={()=> {this.onAnswered(1,question.answerIndex, question.golds)}}>
		                    			<Text style={styles.questionChoiceButtonText}>
		                    			{question.choices[1]}
		                    			</Text>
		                    		</TouchableOpacity>
		                    		<TouchableOpacity 
		                    			style={styles.questionChoiceButton} 
		                    			onPress={()=> {this.onAnswered(3,question.answerIndex, question.golds)}}>
		                    			<Text style={styles.questionChoiceButtonText}>
		                    			{question.choices[3]}
		                    			</Text>
		                    		</TouchableOpacity>
		                    	</View>
		                    	<View style={styles.questionMarksContainer}>
		                    		<Animated.Image 
		                    			style={ {opacity: this.state.fadeAnimWrong } } 
		                    			source={ require('../../assets/wrong.png')} />
		                    		<Animated.Image 
		                    			style={ {opacity: this.state.fadeAnimCorrect }}
		                    			source={require('../../assets/correct.png')} />
		                    	</View>
		                    </View>
		                )
		            }}
		            onSwiped={(cardIndex) => {
		            	this.setState({currentIndex: cardIndex+1})
		            	removeQuestion(this.props.navigation.state.params.questions[cardIndex])
		            }}
		            onSwipedAll={() => {this.onAllSwipedHandler()}}
		            horizontalSwipe={false}
		            verticalSwipe={false}
		            cardIndex={0}
		            backgroundColor={GREEN_COLOR}>
		        </Swiper>
			    <Animated.Text style={[styles.popUpGold, {opacity: this.state.fadeAnimGold}]}>
			    	+ {this.state.getGold}
			    </Animated.Text>
		        <View style={styles.timerContainer}>
			      	<TimerCountdown
			            initialSecondsRemaining={this.state.currentTimeRemaining}
			            onTimeElapsed={() => this.onTimeOutHandler()}
			            allowFontScaling={true}
			            style={styles.timerText}
			        />
				</View>
		    </View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
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
		width: 150,
		resizeMode: 'contain'
	},
	questionText: {
		fontSize: 25,
		margin: 16,
		textAlign: 'center',
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
	questionMarksContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	timerContainer: {
		marginTop: 5,
		marginBottom: 5,
		padding: 5,
	},
	timerText: {
		fontSize: 30,
		color: WHITE_COLOR,
	},
	popUpGold: {
		position: 'absolute',
		right: 20,
		top: 10,
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FDCA50'
	}
});