import React, {
  FC,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import styles from "./Home.module.scss";
import HomeRightContainer from "../components/Home/HomeRightContainer";
import { Transition } from "react-transition-group";
import HomeLeftContainer from "../components/Home/HomeLeftContainer";
import { PersonaSelectModalProps } from "../types/types";
import PersonaSelectModal from "../components/Home/PersonaSelectModal";
import JobSelectModal from "../components/Home/JobSelectModal";

const Home: FC = () => {
  const [selectedMode, setSelectedMode] = useState<number>(-1);
  const [rightContainerWidth, setRightContainerWidth] = useState<number | null>(
    null
  );
  const rightContainerRef = useRef<HTMLDivElement>(null);

  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(
    null
  );
  const [personaInputValue, setPersonaInputValue] = useState<string>("");
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [jobInputValue, setJobInputValue] = useState<string>("");
  const [selectedInterviewType, setSelectedInterviewType] =
    useState<string | null>(null);

  useEffect(() => {
    if (rightContainerRef.current) {
      const width = rightContainerRef.current.offsetWidth;
      setRightContainerWidth(width);
    }
  }, []);

  const openPersonaModal = useCallback(() => {
    setIsPersonaModalOpen(true);
  }, []);

  const closePersonaModal = useCallback(() => {
    setIsPersonaModalOpen(false);
    setPersonaInputValue("");
  }, []);

  const selectPersona = useCallback((persona: string) => {
    setSelectedPersona(persona);
    closePersonaModal();
  }, []);

  const handlePersonaInputChange = useCallback((value: string) => {
    setPersonaInputValue(value);
  }, []);

  const openJobModal = useCallback(() => {
    setIsJobModalOpen(true);
  }, []);

  const closeJobModal = useCallback(() => {
    setIsJobModalOpen(false);
    setJobInputValue("");
  }, []);

  const selectJob = useCallback((job: string) => {
    setSelectedJob(job);
    closeJobModal();
  }, []);

  const handleJobInputChange = useCallback((value: string) => {
    setJobInputValue(value);
  }, []);

  const jobOptions: string[] = [
    "프론트엔드 개발자",
    "백엔드 개발자",
    "풀스택 개발자",
    "안드로이드 개발자",
    "IOS 개발자",
    "데이터 엔지니어",
    "AI 엔지니어",
    "토목직 공무원",
    "군인",
  ];

  const personas: string[] = [
    "꼬리물기에 능한 면접관",
    "프론트엔드 React 특화 면접관",
    "백엔드 Spring 특화 면접관",
  ];

  return (
    <div className={styles.Home}>
      <div className={styles.home_wrapper}>
        <Transition in={selectedMode !== -1} timeout={100}>
          {(state: any) => (
            <HomeLeftContainer
              rightContainerWidth={rightContainerWidth}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              state={state}
            />
          )}
        </Transition>

        <HomeRightContainer
          selectedMode={selectedMode}
          rightContainerRef={rightContainerRef}
          openPersonaModal={openPersonaModal}
          selectedPersona={selectedPersona}
          setOpenPersonaModal={setIsPersonaModalOpen}
          onSelectPersona={selectPersona}
          openJobModal={openJobModal}
          selectedJob={selectedJob}
          setJob={setSelectedJob}
          selectedInterviewType={selectedInterviewType}
          setInterviewType={setSelectedInterviewType}
          closeJobModal={closeJobModal}
          selectJob={selectJob}
          isJobModalOpen={isJobModalOpen}
          closePersonaModal={closePersonaModal} // [추가] prop 전달
          handleJobInputChange={handleJobInputChange} // [추가] prop 전달
          jobInputValue={jobInputValue} // [추가] prop 전달
          isPersonaModalOpen={isPersonaModalOpen} // [추가] prop 전달
        />
        <PersonaSelectModal
          isOpen={isPersonaModalOpen}
          onClose={closePersonaModal}
          onSelect={selectPersona}
          personas={personas}
          onInputChange={handlePersonaInputChange}
          inputValue={personaInputValue}
        />
        <JobSelectModal
          isOpen={isJobModalOpen}
          onClose={closeJobModal}
          onSelect={selectJob}
          jobs={jobOptions}
          onInputChange={handleJobInputChange}
          inputValue={jobInputValue}
        />
      </div>
    </div>
  );
};

export default Home;