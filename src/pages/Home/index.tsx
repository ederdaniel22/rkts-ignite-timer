import {FormProvider, useForm} from 'react-hook-form'
import { HandPalm, Play } from 'phosphor-react'
import * as zod from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { useContext } from 'react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../contexts/CyclesContext'






const newCicleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
  .number()
  .min(5, 'O ciclo precisa ser de no minimo 5 minutos')
  .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCicleFormValidationSchema>

export function Home() {
  const {activeCycle, createNewCicle, interruptCurrentCycle} = useContext(CyclesContext)
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCicleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const {handleSubmit, watch, reset} = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData){
    createNewCicle(data)
    reset()
  }

  

  const task = watch('task')
  const isSubmitDesabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          
          <StopCountdownButton onClick={interruptCurrentCycle}  type="button">
          <HandPalm size={24} />
          Interromper
        </StopCountdownButton>
        ): (
          <StartCountdownButton disabled={isSubmitDesabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
        )}
        
      </form>
    </HomeContainer>
  )
}
