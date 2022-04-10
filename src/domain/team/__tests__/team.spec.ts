import { Team } from "src/domain/team/team"
import { TeamNameVO } from "src/domain/team/team-name-vo"
import { Pair } from "src/domain/team/pair"
import { PairNameVO } from "src/domain/team/pair-name-vo"

describe('teamエンティティ', () => {
  describe('team.ts', () => {

    const pairA = new Pair({
      id: 'pairA',
      pairName: new PairNameVO('a'),
      userIdList: ['user1', 'user2'],
    })
    const pairB = new Pair({
      id: 'pairB',
      pairName: new PairNameVO('b'),
      userIdList: ['user3', 'user4', 'user5'],
    })
    const pairC = new Pair({
      id: 'pairC',
      pairName: new PairNameVO('c'),
      userIdList: ['user6', 'user7'],
    })
    const fiveUsersTeamProps = {
      id: 'teamId',
      teamName: new TeamNameVO(1),
      pairs: [pairA, pairB]
    }
    const team = new Team(fiveUsersTeamProps)

    describe('正常系', () => {

      it('5名の参加者を持つチームエンティティを作成', () => {
        expect(team).toBeInstanceOf(Team)
      })

      it('get pairs()', () => {
        expect(team.pairs).toMatchObject([pairA, pairB])
      })

      it('get userIdList()', () => {
        const mergedUserIdList = pairA.userIdList.concat(pairB.userIdList)
        expect(team.userIdList).toMatchObject(mergedUserIdList)
      })

      it('get allProps', () => {
        const props = fiveUsersTeamProps
        expect(team.allProps).toMatchObject({
          id: props.id,
          teamName: props.teamName.value,
          pairs: props.pairs
        })
      })

      it('getMinimumPair()', () => {
        const minPair = team.getMinimumPair()
        expect(minPair.id).toBe(pairA.id)
      })

      it('generateNonDuplicatePairName()', () => {
        expect(team.generateNonDuplicatePairName()).toBe('c')
      })

      it('getPairByUserId()', () => {
        expect(team.getPairByUserId('user1').id).toBe(pairA.id)
      })

      it('addPair()', () => {
        const testTeam = new Team({
          id: 'teamA',
          teamName: new TeamNameVO(1),
          pairs: [pairA, pairB]
        })
        expect(testTeam.pairs.length).toBe(2)
        testTeam.addPair(pairC)
        expect(testTeam.pairs.length).toBe(3)
      })

      it('removeUser()', () => {
        const testPairA = new Pair({
          id: 'pairA',
          pairName: new PairNameVO('a'),
          userIdList: ['user1', 'user2', 'user3']
        })
        const testPairB = new Pair({
          id: 'pairA',
          pairName: new PairNameVO('a'),
          userIdList: ['user4', 'user5']
        })
        const testTeam = new Team({
          id: 'teamA',
          teamName: new TeamNameVO(1),
          pairs: [testPairA, testPairB]
        })
        expect(testTeam.userIdList.length).toBe(5)
        const firstRemove = testTeam.removeUser('user1')
        expect(testTeam.userIdList.length).toBe(4)
        expect(firstRemove).toEqual([])
        const secondRemove = testTeam.removeUser('user2')
        expect(testTeam.userIdList.length).toBe(3)
        expect(secondRemove).toEqual(['pair'])
        const thirdRemove = testTeam.removeUser('user3')
        expect(testTeam.userIdList.length).toBe(2)
        expect(thirdRemove).toEqual(['team', 'pair'])
      })
    })

    describe('異常系', () => {
      it('2名の参加者を持つチームエンティティを作成するとエラー', () => {
        const props = {
          id: 'teamId',
          teamName: new TeamNameVO(1),
          pairs: [pairA]
        }
        expect(() => new Team(props)).toThrowError()
      })
    })
  })

  describe('team-name-vo.ts', () => {
    describe('正常系', () => {
      it('チーム名「0」を作成', () => {
        const props = 1
        const teamNameVO = new TeamNameVO(props)
        expect(teamNameVO).toBeInstanceOf(TeamNameVO)
        expect(teamNameVO.value).toBe(props)
      })

      it('チーム名「1」を作成', () => {
        const props = 1
        const teamNameVO = new TeamNameVO(props)
        expect(teamNameVO).toBeInstanceOf(TeamNameVO)
        expect(teamNameVO.value).toBe(props)
      })

      it('チーム名「10」を作成', () => {
        const props = 10
        const teamNameVO = new TeamNameVO(props)
        expect(teamNameVO).toBeInstanceOf(TeamNameVO)
        expect(teamNameVO.value).toBe(props)
      })

      it('チーム名「999」を作成', () => {
        const props = 999
        const teamNameVO = new TeamNameVO(props)
        expect(teamNameVO).toBeInstanceOf(TeamNameVO)
        expect(teamNameVO.value).toBe(props)
      })
    })
    describe('異常系', () => {
      it('チーム名「 」を作成するとエラー', () => {
        const props = null
        expect(() => new TeamNameVO(props)).toThrowError()
      })

      it('チーム名「1234」を作成するとエラー', () => {
        const props = 1234
        expect(() => new TeamNameVO(props)).toThrowError()
      })

      it('チーム名「0.5」を作成するとエラー', () => {
        const props = 0.5
        expect(() => new TeamNameVO(props)).toThrowError()
      })
    })
  })
})
