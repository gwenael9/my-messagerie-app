import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { FriendRequest, FriendRequestStatus } from './friendRequest.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    private readonly userService: UserService,
  ) {}

  async sendFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<string> {
    if (senderId === receiverId) {
      throw new UnauthorizedException('Impossible de vous demandez en ami.');
    }

    const sender = await this.userService.findById(senderId);
    const receiver = await this.userService.findById(receiverId);

    if (!sender || !receiver) {
      throw new Error('Utilisateur introuvable.');
    }

    // on vérifie si les deux users sont déjà ami
    await this.userService.verifyIsAlreadyFriend(sender, receiver);

    // on vérifie qu'une requête existe déjà
    const existingRequest = await this.friendRequestRepository.findOne({
      where: { sender, receiver, status: FriendRequestStatus.PENDING },
    });

    if (existingRequest) {
      throw new Error('Une demande est déjà en attente.');
    }

    // on créé la requête
    const friendRequest = this.friendRequestRepository.create({
      sender,
      receiver,
      status: FriendRequestStatus.PENDING,
    });

    // et on la retourne
    await this.friendRequestRepository.save(friendRequest);

    // et on retourne le nom de l'user a qui on fais la demande
    return receiver.firstname;
  }

  async acceptFriendRequest(requestId: number, userId: number): Promise<User> {
    // on vérifie que la requête est bien pour l'user connecté
    const friendRequest = await this.isRequestForMe(requestId, userId);

    // on l'accepte
    friendRequest.status = FriendRequestStatus.ACCEPTED;

    // on sauvegarde les nouveaux amis en bdd
    const { sender, receiver } = friendRequest;

    // on sauvegarde la requête
    await this.friendRequestRepository.save(friendRequest);

    // on renvoie le nouvel User que l'on vient d'ajouter
    return await this.userService.addFriend(sender.id, receiver.id);
  }

  async rejectFriendRequest(requestId: number, userId: number): Promise<void> {
    // on vérifie que la requête est bien pour l'user connecté
    const friendRequest = await this.isRequestForMe(requestId, userId);

    // on la rejette
    friendRequest.status = FriendRequestStatus.REJECTED;

    // on sauvegarde la requête
    await this.friendRequestRepository.save(friendRequest);
  }

  // fonction pour vérifier si la requête est pour moi
  async isRequestForMe(
    requestId: number,
    userId: number,
  ): Promise<FriendRequest> {
    // on vérifie que la requête existe bien
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId },
      relations: ['receiver', 'sender'],
    });

    // s'il n'existe pas ou que le statut est terminé
    if (
      !friendRequest ||
      friendRequest.status !== FriendRequestStatus.PENDING
    ) {
      throw new UnauthorizedException('Demande introuvable ou déjà traitée.');
    }

    // si elle n'est pas destiné à l'user connecté
    if (friendRequest.receiver.id !== userId) {
      throw new UnauthorizedException('Cette requête ne vous ai pas adressée.');
    }
    return friendRequest;
  }

  // recuperer toutes les requetes qui m'ont été envoyées
  async findAllRequest(userId: number): Promise<FriendRequest[]> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable.');
    }

    return await this.friendRequestRepository.find({
      where: { receiver: user, status: FriendRequestStatus.PENDING },
      relations: ['sender'],
    });
  }
}
