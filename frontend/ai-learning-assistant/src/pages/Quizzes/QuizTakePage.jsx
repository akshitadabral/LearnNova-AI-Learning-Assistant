import React,{useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {ChevronLeft,ChevronRight,CheckCircle2} from 'lucide-react';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';

const QuizTakePage=()=>{
  const {quizId}=useParams();
  const navigate=useNavigate();

  const [quiz,setQuiz]=useState(null);
  const [loading,setLoading]=useState(true);
  const [currentQuestionIndex,setCurrentQuestionIndex]=useState(0);
  const [selectedAnswers,setSelectedAnswers]=useState({});
  const [submitting,setSubmitting]=useState(false);

  useEffect(()=>{
    const fetchQuiz=async()=>{
      try{
        const response=await quizService.getQuizById(quizId);
        setQuiz(response.data);
      }catch(error){
        toast.error("Failed to fetch quiz.");
        console.error(error);
      }finally{
        setLoading(false);
      }
    };

    fetchQuiz();
  },[quizId]);

  const handleOptionChange=(questionId,optionIndex)=>{
    setSelectedAnswers(prev=>({
      ...prev,
      [questionId]:optionIndex
    }));
  };

  const handleNextQuestion=()=>{
    if(currentQuestionIndex<quiz.questions.length-1){
      setCurrentQuestionIndex(prev=>prev+1);
    }
  };

  const handlePreviousQuestion=()=>{
    if(currentQuestionIndex>0){
      setCurrentQuestionIndex(prev=>prev-1);
    }
  };

  const handleSubmitQuiz=async()=>{
    const answeredCount=Object.keys(selectedAnswers).length;

    if(answeredCount!==quiz.questions.length){
      toast.error(`Please answer ${quiz.questions.length-answeredCount} more questions.`);
      return;
    }

    setSubmitting(true);

    try{
      const formattedAnswers=Object.keys(selectedAnswers).map(questionId=>{
        const question=quiz.questions.find(q=>q._id===questionId);
        const questionIndex=quiz.questions.findIndex(q=>q._id===questionId);

        return{
          questionIndex,
          selectedAnswer:question.options[selectedAnswers[questionId]]
        };
      });

      await quizService.submitQuiz(quizId,formattedAnswers);

      toast.success("Quiz submitted successfully!");
      navigate(`/quizzes/${quizId}/results`);

    }catch(error){
      toast.error(error.message || "Failed to submit quiz.");
    }finally{
      setSubmitting(false);
    }
  };

  if(loading){
    return(
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner/>
      </div>
    );
  }

  if(!quiz || quiz.questions.length===0){
    return(
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600 text-lg">
          Quiz not found or has no questions.
        </p>
      </div>
    );
  }

  const currentQuestion=quiz.questions[currentQuestionIndex];
  const answeredCount=Object.keys(selectedAnswers).length;
  const allAnswered=answeredCount===quiz.questions.length;

  return(
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-white via-blue-50/30 to-violet-50/40 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
      <PageHeader title={quiz.title || "Take Quiz"}/>
      <div className="text-center mb-8">
    <h2 className="text-3xl font-bold text-slate-900">
        Quiz Challenge
    </h2>

    <p className="text-slate-500 mt-2">
        Answer every question to test your understanding.
    </p>
</div>
<div className="grid grid-cols-3 gap-4 mb-8">

    <div className="rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 p-4 border border-violet-200">
        <p className="text-xs text-slate-500">Questions</p>
        <h3 className="text-2xl font-bold text-violet-700">
            {quiz.questions.length}
        </h3>
    </div>

    <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 p-4 border border-blue-200">
        <p className="text-xs text-slate-500">Answered</p>
        <h3 className="text-2xl font-bold text-blue-700">
            {answeredCount}
        </h3>
    </div>

    <div className="rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 p-4 border border-pink-200">
        <p className="text-xs text-slate-500">Remaining</p>
        <h3 className="text-2xl font-bold text-pink-700">
            {quiz.questions.length - answeredCount}
        </h3>
    </div>

</div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Question {currentQuestionIndex+1} of {quiz.questions.length}
          </span>
          <span className="text-sm text-slate-500">
            {answeredCount} answered
          </span>
        </div>

        <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-indigo-500 transition-all duration-700 ease-out"
            style={{
              width:`${(answeredCount/quiz.questions.length)*100}%`
            }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-violet-50/40 to-blue-50/40 backdrop-blur-xl border-2 border-slate-200 rounded-3xl shadow-xl shadow-violet-100 p-8 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 mb-6">
    <span className="text-sm font-semibold text-violet-700">
        Question {currentQuestionIndex + 1}
    </span>

        </div>

        <h3 className="text-xl font-bold text-slate-900 leading-relaxed mb-8">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option,index)=>{
            const isSelected=selectedAnswers[currentQuestion._id]===index;

            return(
              <label
                key={index}
                className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition ${
                  isSelected
                  ? "border-violet-500 bg-gradient-to-r from-violet-50 via-indigo-50 to-blue-50 shadow-md shadow-violet-200/40"
                  :"border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={isSelected}
                  onChange={()=>handleOptionChange(currentQuestion._id,index)}
                />

                <div className={`w-5 h-5 rounded-full border-2 ${
                  isSelected
                  ?"border-emerald-500 bg-emerald-500"
                  :"border-slate-300"
                }`}>
                  {isSelected&&(
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"/>
                    </div>
                  )}
                </div>

                <span className="ml-4 text-sm font-medium text-slate-700">
                  {option}
                </span>

                {isSelected&&(
                  <CheckCircle2 className="ml-auto text-emerald-500"/>
                )}
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex===0||submitting}
          variant="secondary"
        >
          <ChevronLeft className="w-4 h-4"/>
          Previous
        </Button>

        {currentQuestionIndex===quiz.questions.length-1?
        (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="px-8 h-12 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold"
          >
            {submitting?"Submitting...":allAnswered?"Submit Quiz":`Answer ${quiz.questions.length-answeredCount} More`}
          </button>
        )
        :
        (
          <Button
            onClick={handleNextQuestion}
            disabled={submitting}
          >
            Next
            <ChevronRight className="w-4 h-4"/>
          </Button>
        )}
      </div>

      <div className="mt-10 flex justify-center gap-3 flex-wrap">
        {quiz.questions.map((q,index)=>{
          const answered=selectedAnswers.hasOwnProperty(q._id);

          return(
            <button
              key={index}
              onClick={()=>setCurrentQuestionIndex(index)}
              disabled={submitting}
              className={`w-8 h-8 rounded-lg text-xs font-semibold ${
                index===currentQuestionIndex
                ?"bg-emerald-500 text-white"
                :answered
                ?"bg-emerald-100 text-emerald-700"
                :"bg-slate-100 text-slate-600"
              }`}
            >
              {index+1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTakePage;